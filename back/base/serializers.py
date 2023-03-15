from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile,Flights,CustomUser


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.first_name
        token['email'] = user.email
        if user.last_login == None:
            token['lli'] = False
        else:
            token['lli'] = True
        token['type'] = CustomUser.objects.get(id = user.id).type.desc
        token['role'] = CustomUser.objects.get(id = user.id).role.title
        token['dep'] = CustomUser.objects.get(id = user.id).department.desc

        usr = CustomUser.objects.get(id = user.id)
        usr.last_login = timezone.now()
        usr.save()

        return token
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class GetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class GetUserSelrializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id','first_name','last_name','email','is_active','department','role','type')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user','phoneNum','address','birthDate','needTaxi')

class FlightSerializer(serializers.ModelSerializer):
    # items = serializers.RelatedField(many=True)
    class Meta:
        model = Flights
        fields = '__all__'