from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile, CoachProfile, PlayerProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, full_name=instance.username)
        
        if instance.role == 'COACH':
            CoachProfile.objects.create(user=instance)
        elif instance.role == 'PLAYER':
            PlayerProfile.objects.create(user=instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
    if hasattr(instance, 'coach_profile'):
        instance.coach_profile.save()
    if hasattr(instance, 'player_profile'):
        instance.player_profile.save()
