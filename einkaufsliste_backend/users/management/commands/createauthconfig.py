import random
import string
from django.core.management.base import BaseCommand
from oauth2_provider.models import Application
from users.models import NewUser as User

class Command(BaseCommand):
    """
    Creates an oauth2 application and a user
    for testing purposes.
    """

    def secret_generator(self, size=128, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
        return ''.join(random.choice(chars) for _ in range(size))

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
        _client_secret = self.secret_generator()
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