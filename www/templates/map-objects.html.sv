<!--
  This template loads for the 'tab.friend-detail' state (app.js)
  'friend' is a $scope variable created in the FriendsCtrl controller (controllers.js)
  The FriendsCtrl pulls data from the Friends service (service.js)
  The Friends service returns an array of friend data
-->

<ion-view view-title="Go Green Express" hide-nav-bar="false"> 
<ion-nav-buttons side="right">
{{totalobjects}}, {{currentPage1}}
      <button class="button button-positive"  ng-click="nextitem()">
        Next
      </button>
	  <button class="button button-positive"  ng-click="tickle()">
        Tickle
      </button>
	  <button class="button button-positive "  ng-click="searchlist()">
        Search
      </button>
	  <button class="button button-positive"  ng-click="gotorequests()">
        Requests
      </button>
	  <button class="button button-positive"  ng-click="gotoresponses()">
        Responses
      </button>
    </ion-nav-buttons>
	
	

	
    
      
	  
      <ion-content  data-tap-disabled="true" >
	  
	  
	  
	  
	  


<map id="map" center="{{latitude}},{{ longitude}}" zoom="13">
  
  
      <marker ng-repeat="pos in positions " position="{{pos.loc[0]}}, {{pos.loc[1]}}" on-mouseover="showInfoWindow(event, 
	  'bar{{$index}}')" on-mouseout="hideInfoWindow(event, 'bar{{$index}}')"  on-click="myloc(event, '{{$index}}')">
	  <info-window id="bar{{$index}}" max-width="200"  >
    <div ng-non-bindable="">
      <div id="siteNotice"></div>
      <h3 id="firstHeading" > {{pos.objecttypedesc}}</h3>
      <div id="bodyContent">
	  {{pos.objectdesc}}
	  <p>{{pos.objectdetails}} </p>
	  </div>
	  </div>
	  </info-window>
	  </marker>
	  
  
</map>

 
	  
         
      </ion-content>
    
  
	
    </ion-view>

	