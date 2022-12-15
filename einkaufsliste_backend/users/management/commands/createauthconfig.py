from django.core.management.base import BaseCommand
from oauth2_provider.models import Application
from users.models import NewUser as User
import secrets

class Command(BaseCommand):
    """
    Creates an oauth2 application and a user
    for testing purposes.
    """
    help = 'Creates an oauth2 application and a user for development purposes'

    # def add_arguments(self, parser):
    #     parser.add_argument('password', type=str)

    def handle(self, *args, **options):
        # Create a user
        user = User.objects.create_user(
            # use a random email address to avoid conflicts ending with @setup.de
            email=secrets.token_urlsafe(12) + '@setup.de',
            username=secrets.token_urlsafe(12) + '_oauth2',
            first_name="oauth2",
            password=secrets.token_urlsafe(128),
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
        styling = '\033[7m'
        end_styling = '\033[0m'
        self.stdout.write(self.style.SUCCESS('Successfully created OAUTH application configuration.'))
        print('DJANGO_APP_CLIENT_ID=' + app.client_id)
        print('DJANGO_APP_CLIENT_SECRET=' + _client_secret)
        self.stdout.write(self.style.WARNING('Please copy the values above and add them to your .env file now. Accessing them later is not possible anymore since the client secret is PBKDF2 hashed and cannot be accessed at a later point.'))
        #self.stdout.write(self.style.SUCCESS('DJANGO_APP_CLIENT_ID={}'.format(app.client_id)))
        #self.stdout.write(self.style.SUCCESS('DJANGO_APP_CLIENT_SECRET={}'.format(_client_secret)))