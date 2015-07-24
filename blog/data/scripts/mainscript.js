var vars={};
var oRequest = new XMLHttpRequest ();

function loadVars()
{
  varsIndex=window.location.href.indexOf("?")
  varsLongString=window.location.href.substring(varsIndex+1);
  varsSplitString=varsLongString.split("&");
  numVars=varsSplitString.length
  
  for(var i=0;i<numVars;i++)
  {
    varNameAndContentSplit=varsSplitString[i].split("=");
    vars[varNameAndContentSplit[0]]=varNameAndContentSplit[1];
  }
}

function loadIndex()
{
  var xmlDoc=loadXML("data/PostIndex.xml"); 
  var postsNode=xmlDoc.getElementsByTagName("post");
  var indexElement=document.getElementById("index");
  var indexString="Index<br><ul>";
  for(var i=0;i<postsNode.length;i++)
  {
	if(!vars["title"])
		vars["title"]=postsNode[i].attributes.getNamedItem('safetitle').value;
    indexString+="<li><a href='?title="+postsNode[i].attributes.getNamedItem('safetitle').value+"'>"+postsNode[i].attributes.getNamedItem('title').value+"</a></li>";
  }
  indexString+="</ul>";
  
  indexElement.innerHTML=indexString;
}

function loadXML(sURL)
{
  oRequest.open("GET",sURL,false);	
  oRequest.send()
  
  xmlDoc=oRequest.responseXML; 
  if(!xmlDoc)
  {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(oRequest.responseText,"text/xml");
  }
  return xmlDoc;
}
function loadPost()
{
  var xmlDoc=loadXML("data/posts/"+vars["title"]+".xml");

  postsNode=xmlDoc.getElementsByTagName("post");
  for(var p=0;p<postsNode.length;p++)
  {
    postNode=postsNode[p];
    
    titleText=getChildByName(postNode, "title").childNodes[0].nodeValue;
    timestampText=getChildByName(postNode, "timestamp").childNodes[0].nodeValue;
    contentText=getChildByName(postNode, "content").childNodes[0].nodeValue;
    prettyDate= new Date(timestampText*1000);

    document.getElementById("title").textContent=titleText;
    document.getElementById("timestamp").textContent="Posted on " + prettyDate.toUTCString();
    document.getElementById("content").innerHTML=contentText;
  }
}
window.onload=function()
{
loadVars();
loadIndex();
loadPost();


}

function getChildByName(node, name)
{
  for(var i=0;i<node.childNodes.length;i++)
  {
    if(node.childNodes[i].nodeName==name)
      return node.childNodes[i];
  }
}