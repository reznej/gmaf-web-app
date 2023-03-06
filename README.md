# GMAF-Web-App

The GMAF web app transfers parts of the functionality of GMAF to the web. Developed as part of a study-project, it's based on communication with the [Generic Multimedia Analysis Framework (GMAF)](https://github.com/stefanwagenpfeil/GMAF) developed by Dr. Stefan Wagenpfeil at the faculty of Multimedia and Internet Applications (Fernuniversitaet Hagen), which enables to combine a wide variety of multimedia sources, evaluate, identify and represent them in the form of graph codes.

In the context of search queries and information retrieval, it is increasingly important to classify the meaning of a property. Smart Multimedia Information Retrieval therefore deals, among other things, with concepts for explainability (why is a result displayed as an answer to the search query?) and the evaluation of semantically similar results and recommendations that match a user's search query. Therefore, the GMAF web app implements a comprehensible grid-view according to relevance, supported by detailed-views, which make search results explainable and comparable with one another.

## Installation

1. Install React-App

```bash
cd gmaf-web-app folder
npm i
```

2. Change global variables if required

```js
// /src/helper/env.js
const AUTHKEY = "fp2223";
const APIPATH = "gmaf/gmafApi/gmaf";
```

3. Prevent Same Origin Policy   
By default, communication between different websites is only allowed if both have the same Origin – URI scheme, hostname and port. However, Cross-Origin-Sharing can be allowed by [proxying API requests in development](https://create-react-app.dev/docs/proxying-api-requests-in-development/), specifying GMAF backend address and port as proxy in **package.json**

```js
// package.json
"proxy": "http://localhost:8242/",
```

4. Install GMAF Framework dependencies.  
   To establish communication some code-changes to the GMAF Framework are necessary as well. Therefore:

	- Replace `pom.xml`, `Service.java`, `GMAF-Facade_RESTImpl.java` and `GeneralMetadata.java` with the files stored at `/GMAF Framework Files`
	- Alternatively, add the following code manually

	- **Pom.xml**

	```xml
	<!-- REST API Dependencies-->
	<dependency>
	   <groupId>org.glassfish.jersey.containers</groupId>
	   <artifactId>jersey-container-jdk-http</artifactId>
	   <version>2.38</version>
	</dependency>

	<dependency>
	   <groupId>org.glassfish.jersey.inject</groupId>
	   <artifactId>jersey-hk2</artifactId>
	   <version>2.38</version>
	</dependency>

	<dependency>
	   <groupId>org.glassfish.jersey.media</groupId>
	   <artifactId>jersey-media-json-jackson</artifactId>
	   <version>2.38</version>
	</dependency>

	<dependency>
	   <groupId>com.fasterxml.jackson.core</groupId>
	   <artifactId>jackson-core</artifactId>
	   <version>2.13.2</version>
	</dependency>

	<!-- gmaf-soap client
	<dependency>
		<groupId>de.swa</groupId>
		<artifactId>gmaf-soap</artifactId>
		<version>1.0.0-snapshot</version>
	</dependency>-->
	```

	- **de/swa/gmaf/Service.java**

	```java
	String restApi = "http://" + Configuration.getInstance().getServerName() + ":"
					+ Configuration.getInstance().getRestServicePort() + "/" + Configuration.getInstance().getContext()
					+ "/gmafApi";
	JdkHttpServerFactory.createHttpServer(URI.create(restApi), new GMAF_Facade_RESTImpl());
	Endpoint.publish(api, new GMAF_Facade_SOAPImpl());
	```

	- **de/swa/gmaf/api/GMAF_Facade_RESTImpl.java**

	```java
	/** implementation of the GMAF REST API **/
	@Path("/gmaf")
	public class GMAF_Facade_RESTImpl extends ResourceConfig {
		public GMAF_Facade_RESTImpl() {
			//	packages("de.swa.gmaf.api");
			register(GMAF_Facade_RESTImpl.class);
			register(JacksonFeature.class);
		}

		/** returns a new session token **/
		@GET
		@Path("/getToken/{api-key}")
		public String getAuthToken(
				@PathParam("api-key") String api_key) {
			String uuid = UUID.randomUUID().toString();
			sessions.put(uuid, new GMAF());
			return uuid;
		}


		/** returns a Graph Code for a given MMFG **/
		@POST
	    @Path("/getgc/{auth-token}/{mmfg_id}")
		@Produces("application/json")
		public String getOrGenerateGraphCode(@PathParam("auth-token") String auth_token, @PathParam("mmfg_id") String mmfg_id) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			UUID id = UUID.fromString(mmfg_id);
			MMFG mmfg = coll.getMMFGForId(id);
			GraphCode gc = GraphCodeGenerator.generate(mmfg);
			String json = GraphCodeIO.asJson(gc);
			return json;
		}
		/** returns MMFG for id **/
		@POST
		@Path("/getmmfg/{auth-token}/{mmfg-id}")
		@Produces("application/json")
		public MMFG getMMFGForId(@PathParam("auth-token") String auth_token, @PathParam("mmfg-id") String mmfg_id) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			UUID id = UUID.fromString(mmfg_id);
			return coll.getMMFGForId(id);
		}

		// data structures to hold sessions
		private Hashtable<String, GMAF> sessions = new Hashtable<String, GMAF>();
		private Hashtable<String, String> errorMessages = new Hashtable<String, String>();

		// returns a GMAF_Facade_SOAPImpl for a given API-Key
		@POST
		@Path("/{session}/{api-key}")
		@Produces("application/json")
		public GMAF getSession(@PathParam("api-key") String api_key) {
			if (sessions.contains(api_key)) return sessions.get(api_key);
			else throw new RuntimeException("no valid API key");
		}

		/** returns the collection of MMFGs for a given auth_token **/
		@POST
		@Path("/getCollection/{auth-token}")
		@Produces("application/json")
		@WebMethod
		public Vector<MMFG> getCollection(@PathParam("auth-token") String auth_token) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			return coll.getCollection();
		}

		/** returns an image with given id **/
		@GET
		@Path("/preview/{auth-token}/{id}")
		@Produces("image/*")
		@WebMethod
		public Response getImage(@PathParam("auth-token") String auth_token, @PathParam("id") String mmfg_id) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			UUID id = UUID.fromString(mmfg_id);
			MMFG mmfg = coll.getMMFGForId(id);
			// Build and return a response with the provided image
			File file = mmfg.getGeneralMetadata().getFileReference();
			String type = new MimetypesFileTypeMap().getContentType(file);
			return Response.ok().entity(file).type(type).build();
		}

		/** returns image-URL as String **/
		@POST
		@Path("/preview/{auth-token}/{id}")
		@Produces("application/json")
		@WebMethod
		public String getPreviewURL(@PathParam("auth-token") String auth_token, @PathParam("id")String mmfg_id) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			UUID id = UUID.fromString(mmfg_id);
			MMFG mmfg = coll.getMMFGForId(id);
			return mmfg.getGeneralMetadata().getPreviewUrl().toString();
		}


		/** returns a list of similar assets for a given Graph Code **/
		@POST
	    @Path("/getSim/{auth-token}/{id}")
		@Produces("application/json")
		@WebMethod public Vector<MMFG> getSimilarAssets(@PathParam("auth-token") String auth_token, @PathParam("id")String mmfg_id) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			UUID id = UUID.fromString(mmfg_id);
			MMFG mmfg = coll.getMMFGForId(id);
			GraphCode gc = GraphCodeGenerator.generate(mmfg);
			return coll.getSimilarAssets(gc);
		}

		/** returns a list of recommendations for a given Graph Code **/
		@POST
		@Path("/getRec/{auth-token}/{id}")
		@Produces("application/json")
		@WebMethod public Vector<MMFG> getRecommendedAssets(@PathParam("auth-token") String auth_token, @PathParam("id")String mmfg_id) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			UUID id = UUID.fromString(mmfg_id);
			MMFG mmfg = coll.getMMFGForId(id);
			GraphCode gc = GraphCodeGenerator.generate(mmfg);
			return coll.getRecommendedAssets(gc);
		}

		@POST
		@Path("/query/{auth-token}/{query}")
		@Produces("application/json")
		@WebMethod public String[] queryByKeyword(@PathParam("auth-token") String auth_token, @PathParam("query") String keywords) {
			QueryByKeywordCommand qbk = new QueryByKeywordCommand(keywords);
			qbk.setSessionId(auth_token);
			qbk.execute();
			return getCollectionIds(auth_token);
		}
		@POST
		@Path("/{get-collection-ids}")
		@Produces("application/json")
		@WebMethod public String[] getCollectionIds(@PathParam("auth-token") String auth_token) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			Vector<MMFG> v = coll.getCollection();
			String[] str = new String[v.size()];
			for (int i = 0; i < v.size(); i++) {
				str[i] = v.get(i).getGeneralMetadata().getId().toString();
			}
			return str;
		}

		/** returns Metadata for collection items **/
		@POST
		@Path("/getMetadata/{auth-token}")
		@Produces("application/json")
		@WebMethod public GeneralMetadata[] getCollectionMetadata(@PathParam("auth-token") String auth_token) {
			MMFGCollection coll = MMFGCollection.getInstance(auth_token);
			Vector<MMFG> v = coll.getCollection();
			GeneralMetadata[] str = new GeneralMetadata[v.size()];
			for (int i = 0; i < v.size(); i++) {
				str[i] = v.get(i).getGeneralMetadata();
			}
			return str;
		}
	}
	```

	- **de/swa/mmfg/GeneralMetadata.java**
	  Add or replace following

	```java
	public URL getPreviewUrl() {
		String restPort = "" + Configuration.getInstance().getRestServicePort();
		String preview = "gmafApi/gmaf/preview";
		try {
		previewUrl = new URL("http://" + server + ":" + restPort + "/" + context + "/" + preview + "/" + id.toString() + ".jpg");
		// ...
	```

5. Optional - Install [ReactDeveloper Tools](https://beta.reactjs.org/learn/react-developer-tools)in order to be able to read and understand the states of variables at any time

## Start

```bash
cd gmaf-web-app folder
npm start
```
