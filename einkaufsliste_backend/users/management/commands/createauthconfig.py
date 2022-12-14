from django.core.management.base import BaseCommand
from oauth2_provider.models import Application
from users.models import NewUser as User
import secrets

class Command(BaseCommand):
    """
    Creates an oauth2 application and a user
    for testing purposes.
    """
    help = 'Creates an oauth2 application and a user for testing purposes'

    def add_arguments(self, parser):
        parser.add_argument('password', type=str)

    def handle(self, *args, **options):
        # Create a user
        user = User.objects.create_user(
            email="oauth@test.de",
            username="oauth2",
            first_name="oauth2",
            password=options['password'],
        )
        user.save()
        _client_secret = secrets.token_urlsafe(128)
        app = Application.objects.create(
            name='oauth2',
            user=user,
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_PASSWORD,
            client_secret=_client_secret,
        )
        app.save()
        self.stdout.write(self.style.SUCCESS('Successfully created oauth2 application and user'))
        self.stdout.write(self.style.SUCCESS('Client id: {}'.format(app.client_id)))
        self.stdout.write(self.style.SUCCESS('Client secret: {}'.format(_client_secret)))