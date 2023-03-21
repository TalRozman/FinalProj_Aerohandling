from django.db import models
# from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser


class Departments(models.Model):
    id = models.AutoField(primary_key=True)
    desc = models.CharField(max_length=100)

    def __str__(self):
        return self.desc

class EmploeeType(models.Model):
    id = models.AutoField(primary_key=True)
    desc = models.CharField(max_length=200)

    def __str__(self):
        return self.desc
    
class Roles(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    department = models.ForeignKey(Departments, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
class CustomUser(AbstractUser):
    role = models.ForeignKey(Roles, on_delete=models.CASCADE,null=True)
    department = models.ForeignKey(Departments, on_delete=models.CASCADE,null=True)
    type = models.ForeignKey(EmploeeType,on_delete=models.CASCADE,default=3)

class Profile(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,primary_key=True)
    phoneNum = models.CharField(max_length=10)
    address = models.CharField(max_length=500)
    birthDate = models.DateField(null=True)
    needTaxi = models.BooleanField(default=False)
    image = models.CharField(max_length=10000,null=True, blank=True, default="https://firebasestorage.googleapis.com/v0/b/myfirstproject-38539.appspot.com/o/media%2Fholder.jpeg?alt=media&token=0f691153-a358-4ba4-84e6-2de128532ab9")

    def __str__(self):
        return self.user.first_name

class Flights(models.Model):
    id = models.AutoField(primary_key=True)
    flightNum = models.CharField(max_length=255)
    type = models.CharField(max_length=20)
    stdLocal = models.DateTimeField()
    etdLocal = models.DateTimeField(null=True)
    dest = models.CharField(max_length=255)
    aircraftType = models.CharField(max_length=10)
    aircraftReg = models.CharField(max_length=15)
    gate = models.CharField(max_length=3)
    pit = models.CharField(max_length=10)
    agents = ArrayField(models.IntegerField(null=True),null=True)
    ramp = ArrayField(models.IntegerField(null=True),null=True)
    wingWalker = ArrayField(models.IntegerField(null=True),null=True)
    ambulift = models.BooleanField(null=True)
    obTime = models.DateTimeField(null=True)
    delaycode = ArrayField(models.CharField(max_length=5,null=True),null=True)
    delaytime = ArrayField(models.DateTimeField(null=True),null=True)
    spv = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='supervised_flights')
    arivalAgent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='arrival_agent_flights')
    clc = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='clc_flights')
    sorter = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='sorting_flights')
    pushback = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='pushback_flights')

    def __str__(self):
        return self.flightNum