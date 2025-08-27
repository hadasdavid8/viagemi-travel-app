import os

from django.core.wsgi import get_wsgi_application
settings_module='planner.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'planner.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'planner.settings')

application = get_wsgi_application()
