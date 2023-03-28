import os
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

from .models import Profile,Flights,CustomUser,Roles,Departments,EmploeeType
from .serializers import GetProfileSerializer, MyTokenObtainPairSerializer,UserSerializer,ProfileSerializer,FlightSerializer,GetUserSelrializer,UpdateFlightSerializer

from .scraper import getFlights
import time

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@permission_classes([IsAuthenticated])
@api_view(["POST"])
def changePwd(request,id):
    try:
        usr = CustomUser.objects.get(id = id)
        usr.set_password(request.data["password"])
        usr.save()
    except CustomUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_202_ACCEPTED)


@permission_classes([IsAuthenticated])
@api_view(["POST"])
def register(request):
    print(request.data)
    user = CustomUser.objects.create_user(
                username=request.data['email'],
                email=request.data['email'],
                password=request.data['password'],
                first_name = request.data['first_name'],
                last_name = request.data['last_name'],
                role = Roles.objects.get(id = request.data['role']),
                department = Departments.objects.get(id = request.data['department']),
                type = EmploeeType.objects.get(id = request.data['type']),
                )
    user.is_active = True
    user.is_staff = False
    user.save()
    return Response(status=status.HTTP_201_CREATED)

class MyUsersView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request,id):
        try:
            my_model = CustomUser.objects.get(id=id)
            serializer = UserSerializer(my_model, many=False)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
   
    def patch(self, request, id):
        my_model = CustomUser.objects.get(id=id)
        if my_model.is_active:
            my_model.is_active = False
        else:
            my_model.is_active = True
        my_model.save()
        return Response(status=status.HTTP_200_OK)
    
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def getAllProfiles(req):
    try:
        res = []
        my_users = CustomUser.objects.all()
        my_prfl = Profile.objects.all()
        usr_serializer = GetUserSelrializer(my_users,many = True).data
        prfl_serializer = GetProfileSerializer(my_prfl,many=True).data
        res = {"Users":usr_serializer,"Profiles":prfl_serializer}
        return Response(res)
    except Profile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def getAllUsers(req):
    users = CustomUser.objects.all()
    usr_serializer = GetUserSelrializer(users,many = True).data
    return Response(usr_serializer)

@permission_classes([IsAuthenticated])
class MyProfileView(APIView):
    def get(self,request,user):
        try:
            myModel = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serailizer = GetProfileSerializer(myModel,many=False)
        return Response(serailizer.data)
    
    def post(self,request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        

    def put(self, request, user):
        my_model = Profile.objects.get(user=user)
        serializer = ProfileSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])
@api_view(["PATCH"])
def editPic(request,user):
    pro = Profile.objects.get(user = user)
    reqImage = request.data['picture']
    pro.image = reqImage
    pro.save()
    return Response(status=status.HTTP_202_ACCEPTED)        


@permission_classes([IsAuthenticated])
@api_view(["PATCH"])
def delPic(request,user):
    pro = Profile.objects.get(user = user)
    if pro.image != "https://firebasestorage.googleapis.com/v0/b/myfirstproject-38539.appspot.com/o/media%2Fholder.jpeg?alt=media&token=0f691153-a358-4ba4-84e6-2de128532ab9":
        pro.image = "https://firebasestorage.googleapis.com/v0/b/myfirstproject-38539.appspot.com/o/media%2Fholder.jpeg?alt=media&token=0f691153-a358-4ba4-84e6-2de128532ab9"
    pro.save()
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(["GET"])
def GetFlights(req):
    res = getFlights()
    for i in res["flights"]:
        f = Flights(flightNum = i["flightNum"],dest = i["dest"],stdLocal=i["stdLocal"],type=i["type"],aircraftType=i["aircraftType"],aircraftReg=i["aircraftReg"],gate=i["gate"],pit=i["pit"])
        f.save()
    return Response(status=status.HTTP_200_OK)

if (time.time() - 1672606800) % 86400 == 0:
    GetFlights()

@permission_classes([IsAuthenticated])
class MyFlightsView(APIView):
    def get(self,request):
        myModel = Flights.objects.all()
        serailizer = FlightSerializer(myModel,many=True)
        return Response(serailizer.data)      

    def patch(self, request, id):
        my_model = Flights.objects.get(id=id)
        serializer = UpdateFlightSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
