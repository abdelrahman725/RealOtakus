from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
from django.utils import timezone
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError


class UserAccountManager(BaseUserManager):
    def create_user(
        self, email, password=None, is_staff=False, is_superuser=False, **kwargs
    ):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(email=email, **kwargs)

        user.set_password(password)
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **kwargs):
        user = self.create_user(
            email, password=password, is_staff=True, is_superuser=True, **kwargs
        )

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[username_validator],
    )

    email = models.EmailField(unique=True, max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        abstract = True
        
    def clean(self):
        if self.is_superuser and self.is_active == False:
            raise ValidationError("admin user cannot be inactive")

    def __str__(self):
        return self.email
