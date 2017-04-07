
'use strict'

//------------------------------------------------------------------------------------------------------------------------------------------
var User;
var Group;
var Cancel = false;
var CountLikes = 0;
var Groups = [];
var SearchGroups = [];
var AllGroups = [];
var Likes = [];
//------------------------------------------------------------------------------------------------------------------------------------------
if (!Date.prototype.toStr) {
  (function()
  {

    function pad(number)
    {
      if (number < 10) return '0' + number;
      return number;
    }

    Date.prototype.toStr = function()
    {
      return pad(this.getUTCDate()) + '.' + pad(this.getUTCMonth() + 1) + '.' + this.getUTCFullYear() +
        ' ' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes());
    };
  }());
}
//------------------------------------------------------------------------------------------------------------------------------------------
function d2s (time) 
{
	return (new Date(time * 1000)).toStr();
}
/*
function D2S(d)
{
	console.log(d.toStr());
	//var dtf = new Intl.DateTimeFormat("ru-RU", {   year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"}); // , second: "numeric"} );
	return d.toStr(); //(dtf.format(d));
}
*/
//------------------------------------------------------------------------------------------------------------------------------------------
function uvl(v,d)
{
	//return ((typeof v)=='undefined'?d:v); 
	return (v===undefined?d:v); 
}
//------------------------------------------------------------------------------------------------------------------------------------------
function Create(type,attr) 
{
	var elm = document.createElement(type);
	if ((typeof attr.id)		!='undefined') elm.id 			= attr.id;
	if ((typeof attr.class)	!='undefined') elm.className 	= attr.class;
	if ((typeof attr.html)	!='undefined') elm.innerHTML 	= attr.html;
	if ((typeof attr.width)	!='undefined') elm.width 		= attr.width;
	if ((typeof attr.src)	!='undefined') elm.setAttribute ("src",attr.src);
	if ((typeof attr.child)	!='undefined') elm.appendChild  (child);
	return elm;
}
//------------------------------------------------------------------------------------------------------------------------------------------
function ShowFriend (friend)
{
	var article = Create('article',{class:'friend'});
	var tr = article.appendChild(document.createElement('table')).appendChild(document.createElement('tr'));

	var id = uvl(friend.uid,friend.id);
	var last_seen = ' n/a ';
	if (friend.last_seen!==undefined) last_seen = d2s(friend.last_seen.time);

	tr.appendChild(Create('td', {width:90,  html:'<a href="https://vk.com/' + friend.domain + '"><p>' + id + '</p></a><p class="date' + (friend.online==1?' green':'') + '" >' + last_seen + '</p>'}));
	tr.appendChild(document.createElement('td')).appendChild (Create('img',{src:friend.photo_50}));
	tr.appendChild(Create('td', {width:120, html:'<p>'+friend.first_name + '<br />' + friend.last_name+'</p>'}));
	tr.appendChild(Create('td', {width:80, html:'<p>'+uvl(friend.bdate,"")+'</p>'}));

	var btn = Create('button', { id:id, html:'Выбрать'});
	btn.addEventListener ("click", function(event) {  GetGroups ( event.currentTarget.id);  GetUser(event.currentTarget.id); Select(null, 'groups_data','groups');  });
	tr.appendChild(document.createElement('td')).appendChild (btn);

	return (article);
}

//------------------------------------------------------------------------------------------------------------------------------------------
function GetFriends (id)
{
	console.log('GetFriends(' + id + ')');
	var fd = document.getElementById('friends_data');
	fd.innerHTML = '';	
	Select(null, 'friends_data','friends');
	
  	VK.api('friends.get', {user_id:id, fields:"id,uid,first_name,last_name,deactivated,hidden,about,activities,bdate,blacklisted,blacklisted_by_me,books,can_post,can_see_all_posts,can_see_audio,can_send_friend_request,can_write_private_message,career,city,common_count,connections,contacts,counters,country,crop_photo,domain,education,exports,first_name_nom,first_name_gen,first_name_dat,first_name_acc,first_name_ins,first_name_abl,followers_count,friend_status,games,has_mobile,has_photo,home_town,interests,is_favorite,is_friend,is_hidden_from_feed,last_name_nom,last_name_gen,last_name_dat,last_name_acc,last_name_ins,last_name_abl,last_seen,lists,maiden_name,military,movies,music,nickname,occupation,online,online_mobile,online_app,personal,photo_50,photo_100,photo_200_orig,photo_200,photo_400_orig,photo_id,photo_max,photo_max_orig,quotes,relatives,relation,schools,screen_name,sex,site,status,timezone,tv,universities,verified,wall_comments"
  									, order:"hints", version:"5.8"}, 
  		function(data)
  		{
			var table = document.createElement('table');
	    	var tbody = table.appendChild(document.createElement('tbody'));
	    	var items = data.response.items!==undefined?data.response.items:data.response;
			for (var i = 0; i < items.length; i++)
			{
				fd.appendChild( ShowFriend (items[i]) );
			/*
				var tr = tbody.appendChild(document.createElement('tr'));
				var id = uvl(items[i].uid,items[i].id);
				var last_seen = ' n/a ';
				if (items[i].last_seen!==undefined) last_seen = d2s(items[i].last_seen.time);
	    		tr.appendChild(document.createElement('td')).innerHTML = ('<p><a href="https://vk.com/' + items[i].domain + '">' + id + '</a></p>'
	    				+ '<p class="date' + (items[i].online==1?' green':'') + '" >' + last_seen + '</p>');
	    		tr.appendChild(document.createElement('td')).appendChild (document.createElement('img')).setAttribute("src",items[i].photo_50);
	    		tr.appendChild(document.createElement('td')).innerHTML = (items[i].first_name + '<br />' + items[i].last_name);
	    		tr.appendChild(document.createElement('td')).innerHTML = (uvl(items[i].bdate,""));

	    		
	    		var btn = document.createElement('button');
	    		btn.innerHTML = 'Выбрать';
	    		btn.id=id;
	    		btn.addEventListener ("click", function(event) {  GetGroups ( event.currentTarget.id);  GetUser(event.currentTarget.id); Select(null, 'groups_data','groups');  });
	    		tr.appendChild(document.createElement('td')).appendChild (btn);
	    	*/
			}
			fd.style.display = "block";
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function ShowUser(user) 
{
	var article = document.createElement('article');
	var tr = article.appendChild(document.createElement('table')).appendChild(document.createElement('tr'));

	tr.appendChild(document.createElement('td')).innerHTML = ('<a href="https://vk.com/' + user.domain + '"><p>' + User.id + '</p></a><p class="date' + (user.online==1?' green':'') + '" >' + d2s(user.last_seen.time) + '</p>');;
	tr.appendChild(document.createElement('td')).appendChild(document.createElement('img')).setAttribute("src",user.photo_50);
	tr.appendChild(document.createElement('td')).innerHTML = '<p class="name">'+ user.first_name + '<br />' + user.last_name + '</p>';
	tr.appendChild(Create('td', {class:'counter', html:'<button onclick="GetFriends('+user.id+')" >Друзей</button><p>' + user.counters.friends + '</p>'}));
	tr.appendChild(Create('td', {class:'counter', html:'<button onclick="GetGroups('+user.id+')">Групп</button><p>'  + ((typeof user.groups)!='undefined'?user.counters.groups:user.counters.pages) + '</p>'}));
	tr.appendChild(Create('td', {class:'counter', html:'<header>Аудио</header><p>'  + uvl(user.counters.audios,'-') + '</p>'}));
	tr.appendChild(Create('td', {class:'counter', html:'<header>Видео</header><p>'  + uvl(user.counters.videos,'-') + '</p>'}));
	tr.appendChild(Create('td', {class:'counter', html:'<header>Фото</header><p>'   + uvl(user.counters.photos,'-') + '</p>'}));

	return (article);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function GetUser(id) 
{
	document.getElementById('user_data').innerHTML = '';
  	VK.api('users.get', {user_ids:id, fields:"id,first_name,last_name,deactivated,hidden,about,activities,bdate,blacklisted,blacklisted_by_me,books,can_post,can_see_all_posts,can_see_audio,can_send_friend_request,can_write_private_message,career,city,common_count,connections,contacts,counters,country,crop_photo,domain,education,exports,first_name_nom,first_name_gen,first_name_dat,first_name_acc,first_name_ins,first_name_abl,followers_count,friend_status,games,has_mobile,has_photo,home_town,interests,is_favorite,is_friend,is_hidden_from_feed,last_name_nom,last_name_gen,last_name_dat,last_name_acc,last_name_ins,last_name_abl,last_seen,lists,maiden_name,military,movies,music,nickname,occupation,online,online_mobile,online_app,personal,photo_50,photo_100,photo_200_orig,photo_200,photo_400_orig,photo_id,photo_max,photo_max_orig,quotes,relatives,relation,schools,screen_name,sex,site,status,timezone,tv,universities,verified,wall_comments"}, // 
  		function(data)
  		{
			for (var i = 0; i < data.response.length; i++)
			{
				User = data.response[i];
				User.id = ((typeof data.response[i].uid)=='undefined'?data.response[i].id:data.response[i].uid);
				document.getElementById('user_data').appendChild(ShowUser(User));
			}
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function GetPosts (id)
{
  	VK.api('wall.get', {owner_id:-id, count:1}, 
  		function(data)
  		{
			while (document.getElementById('posts')==null) sleep (200);
			document.getElementById('posts').innerHTML = uvl(data.response.count,'-');
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function GetGroup (id)
{
	console.log('GetGroup(' + id + ')');
	document.getElementById('user_data').innerHTML = '';
  	VK.api('groups.getById', {group_id:id, fields:"id,name,screen_name,is_closed,deactivated,is_admin,admin_level,is_member,invited_by,type,has_photo,photo_50,photo_100,photo_200,activity,age_limits,ban_info,can_create_topic,can_message,can_post,can_see_all_posts,can_upload_doc,can_upload_video,city,contacts,counters,cover,description,fixed_post,is_favorite,is_hidden_from_feed,is_messages_allowed,links,main_album_id,market,member_status,members_count,place,public_date_label,site,start_date,finish_date,status,verified,wiki_page"}, 
  		function(data)
  		{
			var table = document.createElement('table');
	    	var tbody = table.appendChild(document.createElement('tbody'));
			for (var i = 0; i < data.response.length; i++)
			{
				Group = data.response[i];
				Group.id = uvl(data.response[i].id,data.response[i].gid);
				GetPosts (Group.id);
				var tr = tbody.appendChild(document.createElement('tr'));
				tr.appendChild(document.createElement('td')).innerHTML = ('<p>' + Group.id + '</p><p class="date" >' + d2s(data.response[i].start_date) + '</p>');;
	    		tr.appendChild(document.createElement('td')).appendChild(document.createElement('img')).setAttribute("src",data.response[i].photo_50);
	    		tr.appendChild(document.createElement('td')).innerHTML = '<p>' + data.response[i].name + '</p>';
	    		tr.appendChild(document.createElement('td')).innerHTML = '<header class="counter">Членов</header><footer>' + data.response[i].members_count + '</footer>';
	    		tr.appendChild(document.createElement('td')).innerHTML = '<header class="counter">Постов</header><footer id="posts">' + '-' + '</footer>';
	    		tr.appendChild(document.createElement('td')).innerHTML = '<header class="counter">Аудио</header><footer>'  + uvl(data.response[i].counters.audios,'-') + '</footer>';
	    		tr.appendChild(document.createElement('td')).innerHTML = '<header class="counter">Видео</header><footer>'  + uvl(data.response[i].counters.videos,'-') + '</footer>';
	    		tr.appendChild(document.createElement('td')).innerHTML = '<header class="counter">Фото</header><footer>'   + uvl(data.response[i].counters.photos,'-') + '</footer>';
			}
			document.getElementById('user_data').appendChild(table);
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function GetGroups(id) 
{
	console.log('GetGroups(' + id + ')');
	document.getElementById('groups_data').innerHTML = '';	
	Select(null, 'groups_data','groups');
	VK.api('groups.get', { user_id:id, extended:'1', fields:"id,name,screen_name,is_closed,deactivated,is_admin,admin_level,is_member,invited_by,type,has_photo,photo_50,photo_100,photo_200,activity,age_limits,ban_info,can_create_topic,can_message,can_post,can_see_all_posts,can_upload_doc,can_upload_video,city,contacts,counters,cover,description,fixed_post,is_favorite,is_hidden_from_feed,is_messages_allowed,links,main_album_id,market,member_status,members_count,place,public_date_label,site,start_date,finish_date,status,verified,wiki_page" }, 
  		function(data)
  		{
        	console.log('groups.get - response');
			var table = document.createElement('table');
	    	var tbody = table.appendChild(document.createElement('tbody'));
		  	if(data.response!==undefined)
		  	{
		  		Groups = data.response.items;
				for (var i = 0; i < data.response.items.length; i++)
				{
					var tr = tbody.appendChild(document.createElement('tr'));
					tr.appendChild(document.createElement('td')).innerHTML = '<a href="https://vk.com/' + data.response.items[i].screen_name + '">' + data.response.items[i].id + '</a>';
	    			tr.appendChild(document.createElement('td')).appendChild(document.createElement('img')).setAttribute("src",data.response.items[i].photo_50); //.photo_100
	    			tr.appendChild(document.createElement('td')).innerHTML = data.response.items[i].name;
	    			var btn = document.createElement('button');
	    			btn.innerHTML = 'Выбрать';
	    			btn.id=data.response.items[i].id;
	    			btn.addEventListener ("click", 
	    				function(event)
	    				{
	    					Cancel = true;
	    					GetGroup (event.currentTarget.id);
	    					//document.getElementById('likes_data').innerHTML = '';
	    					//CountLikes = 0;
	    					//Cancel = false;
	    					//GetLikes ( event.currentTarget.id,0,document.getElementById('max').value );
	    					//Select(null, 'likes_data','likes');
	    				}
	    			);
	    			tr.appendChild(document.createElement('td')).appendChild (btn);
				}
				document.getElementById('groups_data').appendChild(table);
			}
			else
			{
				document.getElementById('groups_data').innerHTML = data.error.error_msg;
				console.log(data);
			}
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function ShowLike (like,group)
{
	var article = document.createElement('article');
	article.className = "post";
	var tr = article.appendChild(document.createElement('table')).appendChild(document.createElement('tr'));
	var td = tr.appendChild(document.createElement('td'));
	var a = td.appendChild(document.createElement('a'));
	a.setAttribute("href",'https://vk.com/' + group.screen_name);
	var img = a.appendChild(document.createElement('img'));
	img.setAttribute("src",group.photo_50);
	img.setAttribute("alt",group.name); 
	img.setAttribute("title",group.name);
	var f = td.appendChild(document.createElement('footer'));
	//f.innerHTML += ('<p><a href="https://vk.com/wall'+like.post.from_id+'_'+like.post.id+'">' + like.post.id + '</a></p>');
	f.innerHTML += ('<a href="https://vk.com/wall'+like.post.from_id+'_'+like.post.id+'"><p class="date">' + d2s(like.post.date) + '</p></a>');
	var photo = null;
	if(like.post.attachments !== undefined)
   	for (var a = 0; a < like.post.attachments.length; a++)
   		if(like.post.attachments[a].type="photo")
   			if (like.post.attachments[a].photo !==undefined) { photo = like.post.attachments[a].photo.photo_604; break; }  // 75,130,604
   			else if (like.post.attachments[a].doc !==undefined) { photo = like.post.attachments[a].doc.url; break; } 
   if(photo != null) tr.appendChild(document.createElement('td')).appendChild (document.createElement('img')).setAttribute("src",photo);
   td = tr.appendChild(document.createElement('td'));
   td.className = "text";
   var s = td.appendChild(document.createElement('section'));
   s.className = "text";
   s.innerHTML = ('<p class="text">' + like.post.text + '</p>');
	return (article);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function ShowLikes (likes,group)
{
	var ld = document.getElementById('likes_data');
	CountLikes += likes.length;
	//for (var i = 0; i < likes.length; i++) ld.appendChild(ShowLike(likes[i],group));	
	for (var i = 0; i < likes.length; i++) Likes.push({"like": likes[i], "group":group });
	Likes.sort( function(a, b) {return (b.like.post.date-a.like.post.date);} );
	ld.innerHTML='';	
	for (var i = 0; i < Likes.length; i++) ld.appendChild(ShowLike(Likes[i].like,Likes[i].group));
}
//------------------------------------------------------------------------------------------------------------------------------------------
function sleep(ms,start)
{
  start = (((typeof start)==='undefined')?(new Date().getTime()):start) ;
  for (var i = 0; i < 1e7; i++) if ((new Date().getTime() - start) > ms) break;
}
//------------------------------------------------------------------------------------------------------------------------------------------
function GetLikesCode (gid,offset)
{
	var Code =  'var p = API.wall.get ({ owner_id: -' + gid + ', count:24, offset:' + offset + ' }); '
				+ ' var posts = p; ' 
				+ ' var c = p.count; '
				+ ' var res={}; '
				+ ' var i=1; '
				+ ' if(p.items.length>=0) { posts = p.items; i=0; } '
				+ ' while(i< posts.length) '
				+ ' { '
				+ '	 var likes = API.likes.getList ({ type:"post", owner_id: posts[i].from_id, item_id: posts[i].id, friends_only:1, skip_own:0 }); '
				+ '	 if(likes.count>0) ' 
			   + '      res.push({"post":posts[i], "likes":likes});'
				+ '	 i = i+1; '
				+ ' } '
				+ ' return { "date":posts[i-1].date, "count":c, "res":res };';
	return Code;
} 
//------------------------------------------------------------------------------------------------------------------------------------------
function GetLikes(gid,offset,date) 
{
var likes = [];
	count = uvl(count,5);
	console.log('GetLikes:'+ gid + ' - ' + offset+ ' - ' + count);
	VK.api('execute', {"code": GetLikesCode(gid,offset)}, 
  		function(data)
  		{
		  	if(data.response!==undefined) 
		  	{
		  		var res = data.response.res;
		  		for ( var i = 0; i < res.length; i++) for( var l = 0; l < res[i].likes.items.length; l++ ) if(res[i].likes.items[l] == User.id) likes.push ( res[i] );
	  			if (likes.length > 0) ShowLikes (likes, Group);
	  			document.getElementById('count').innerHTML = offset + ':' + CountLikes ;	
		  		sleep(280);
		  		if( !Cancel && offset < data.response.count+500  ) GetLikes (gid,offset+24,count);
		  	}
		  	else console.log(data);
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function GetLikesDay(g,offset,date)
{
var likes = [];
//var date = d; //uvl(d,((new Date()) - 5*86400*1000)/1000);
	console.log('GetLikesDay('+g+', '+offset+', '+(date)+')');
	if(SearchGroups.length==0)
	{
		Start(false);
		return;
	}
	if(g>=SearchGroups.length) {g=0; offset += 24;}
	VK.api('execute', {"code": GetLikesCode(SearchGroups[g].id,offset)}, 
  		function(data)
  		{
		  	if(data.response!==undefined) 
		  	{
		  		console.log(data);
		  		var res = data.response.res;
		  		for ( var i = 0; i < res.length; i++ ) for( var l = 0; l < res[i].likes.items.length; l++ ) if( res[i].likes.items[l] == User.id ) likes.push ( res[i] );
	  			if (likes.length > 0) ShowLikes (likes, SearchGroups[g]);
	  			document.getElementById('count').innerHTML = g + ':' + offset + ':' + CountLikes ;	
		  		sleep(300);
		  		//console.log('r.date:'+data.response.date + ', date:'+date);
		  		if( data.response.date==null || data.response.date < date ) SearchGroups.splice(g,1);
		  		if( !Cancel && offset < data.response.count+500 ) GetLikesDay (g+1, offset, date);
		  	}
		  	else console.log(data);
		}
	);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function SearchInGroups(t) 
{
	var ids = '';
	var MaxCount = 1500; //145000000;
		ids = '0';
		for (var i=1;i<=500;i++) ids += ',' + (t*500+i);
		console.log(ids);
	  	VK.api('groups.getById', {group_ids:ids, fields:"members_count"}, 
  			function(data)
  			{
		  		if(data.response!==undefined) 
		  		{
		  			console.log(data);
		  			for ( var i = 0; i < data.response.length; i++ ) if ( data.response[i].is_closed == 0 && data.response[i].members_count > 10 ) AllGroups.push ( data.response[i] );
		  			sleep(300);
		  			if( !Cancel && t*500<MaxCount ) SearchInGroups(t+1);
		  			else console.log ( AllGroups );
		  		}
		  		else console.log(data);
			}
		);
}
//------------------------------------------------------------------------------------------------------------------------------------------
function InitOk()
{
	VK.callMethod("resizeWindow", 800, 640); // Максимальное значение ширины окна — 1000 px, высоты — 4050.

   GetUser ();
   GetFriends ();	

   //setTimeout( GetGroups (189070371), 3000 );
   //GetGroups (189070371);
   //GetLikes(30022666,0);
   //GetLikes(50106785,0);

}
//------------------------------------------------------------------------------------------------------------------------------------------
window.onload = (
	function()
	{
   	VK.init ( InitOk(), function() { console.log('Error'); }, '5.8');
	} );
//------------------------------------------------------------------------------------------------------------------------------------------
function Start(state)
{
	var btn = document.getElementById('start'); 
	console.log('Groups.length:' + Groups.length + ', state:' + state + ', btn.innerHTML:' + btn.innerHTML);

	if(Groups.length>0 && state && btn.innerHTML == 'Искать')
	{
		SearchGroups = Groups.slice();
		Likes = [];
		Cancel = false;
		document.getElementById('likes_data').innerHTML = '';
		CountLikes = 0;
		var d = ((new Date()) - document.getElementById('sel').value*86400*1000)/1000;
		GetLikesDay(0,0,d);
		Select(null, 'likes_data','likes');
		btn.innerHTML = 'Стоп';
		document.getElementById("ml").style.display = "block";
	}
	else
	{
		Cancel = true;
		sleep(500);
		btn.innerHTML = 'Искать';
		document.getElementById("ml").style.display = "none";
	}
}
//------------------------------------------------------------------------------------------------------------------------------------------
function Select(evt, TabName, id) 
{
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) tablinks[i].className = tablinks[i].className.replace(" active", "");

    document.getElementById(TabName).style.display = "block";
    //evt.currentTarget.className += " active";
    document.getElementById(id).className += " active";
}
//------------------------------------------------------------------------------------------------------------------------------------------
