import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from users.models import User
from workspaces.models import Workspace, WorkspaceMember
from projects.models import Project
from issues.models import Label, Issue, Comment, ActivityLog
from core.choices import WorkspaceRole, IssueStatus, IssuePriority, ActivityAction

DUMMY_PASSWORD = "password123"

USERS = [
    {"username": "aisha", "email": "aisha@forge.dev", "first_name": "Aisha", "last_name": "Khan"},
    {"username": "rohan", "email": "rohan@forge.dev", "first_name": "Rohan", "last_name": "Mehta"},
    {"username": "sara", "email": "sara@forge.dev", "first_name": "Sara", "last_name": "Ali"},
    {"username": "dev", "email": "dev@forge.dev", "first_name": "Dev", "last_name": "Patel"},
    {"username": "nina", "email": "nina@forge.dev", "first_name": "Nina", "last_name": "Roy"},
]

WORKSPACE_NAMES = ["Nimbus Labs", "Orbit Studio"]

PROJECT_POOL = [
    ("Website Revamp", "#6366F1"),
    ("Mobile App", "#10B981"),
    ("API Gateway", "#F59E0B"),
    ("Internal Tools", "#EF4444"),
]

LABEL_POOL = [
    ("Bug", "#EF4444"),
    ("Feature", "#10B981"),
    ("Improvement", "#6366F1"),
    ("Docs", "#94A3B8"),
    ("Urgent", "#F59E0B"),
]

ISSUE_TITLES = [
    "Fix login redirect loop",
    "Add dark mode toggle",
    "Improve API response time",
    "Update onboarding flow",
    "Refactor auth middleware",
    "Add pagination to issue list",
    "Fix broken avatar upload",
    "Write API documentation",
    "Add email notifications",
    "Optimize database queries",
    "Fix mobile responsive layout",
    "Add export to CSV feature",
    "Handle expired JWT gracefully",
    "Add search functionality",
    "Fix timezone bug in due dates",
]

COMMENT_TEXTS = [
    "Looking into this now.",
    "Can we get a screenshot of the issue?",
    "This should be fixed in the next release.",
    "Confirmed, reproducible on staging.",
    "Marking as high priority.",
]


class Command(BaseCommand):
    help = "Seed the database with demo data for dashboard/UI development."

    def handle(self, *args, **options):
        self.stdout.write("Clearing existing seeded data...")
        ActivityLog.objects.all().delete()
        Comment.objects.all().delete()
        Issue.objects.all().delete()
        Label.objects.all().delete()
        Project.objects.all().delete()
        WorkspaceMember.objects.all().delete()
        Workspace.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        self.stdout.write("Creating users...")
        users = []
        for u in USERS:
            user = User.objects.create_user(
                username=u["username"],
                email=u["email"],
                first_name=u["first_name"],
                last_name=u["last_name"],
                password=DUMMY_PASSWORD,
            )
            users.append(user)

        self.stdout.write("Creating workspaces, members, projects, labels, issues...")
        for ws_name in WORKSPACE_NAMES:
            owner = random.choice(users)
            workspace = Workspace.objects.create(name=ws_name, owner=owner)

            WorkspaceMember.objects.create(user=owner, workspace=workspace, role=WorkspaceRole.ADMIN)
            members = [owner]
            for user in users:
                if user == owner:
                    continue
                role = random.choice([WorkspaceRole.ADMIN, WorkspaceRole.MEMBER])
                WorkspaceMember.objects.create(user=user, workspace=workspace, role=role)
                members.append(user)

            labels = [
                Label.objects.create(workspace=workspace, name=name, color=color)
                for name, color in LABEL_POOL
            ]

            project_sample = random.sample(PROJECT_POOL, k=random.randint(3, 4))
            for proj_name, color in project_sample:
                project = Project.objects.create(
                    workspace=workspace,
                    name=proj_name,
                    description=f"{proj_name} for {ws_name}.",
                    color=color,
                    created_by=owner,
                )

                for _ in range(random.randint(15, 20)):
                    reporter = random.choice(members)
                    assignee = random.choice(members) if random.random() > 0.15 else None
                    status = random.choice(IssueStatus.values)
                    priority = random.choice(IssuePriority.values)
                    due_date = (
                        timezone.now().date() + timedelta(days=random.randint(-5, 20))
                        if random.random() > 0.3 else None
                    )

                    issue = Issue.objects.create(
                        project=project,
                        title=random.choice(ISSUE_TITLES),
                        description="Auto-generated seed issue for dashboard testing.",
                        status=status,
                        priority=priority,
                        assignee=assignee,
                        reporter=reporter,
                        due_date=due_date,
                    )
                    issue.labels.set(random.sample(labels, k=random.randint(0, 2)))

                    ActivityLog.objects.create(
                        issue=issue,
                        user=reporter,
                        action=ActivityAction.CREATED,
                        metadata={},
                    )

                    if assignee:
                        ActivityLog.objects.create(
                            issue=issue,
                            user=reporter,
                            action=ActivityAction.ASSIGNED,
                            metadata={"assignee_id": assignee.id},
                        )

                    if random.random() > 0.5:
                        commenter = random.choice(members)
                        Comment.objects.create(
                            issue=issue,
                            author=commenter,
                            body=random.choice(COMMENT_TEXTS),
                        )
                        ActivityLog.objects.create(
                            issue=issue,
                            user=commenter,
                            action=ActivityAction.COMMENTED,
                            metadata={},
                        )

        self.stdout.write(self.style.SUCCESS("Seeding complete."))