package de.swa.gmaf.api;
import de.swa.gc.GraphCode;
import de.swa.gc.GraphCodeGenerator;
import de.swa.gc.GraphCodeIO;
import de.swa.gmaf.GMAF;
import de.swa.mmfg.GeneralMetadata;
import de.swa.mmfg.MMFG;
import de.swa.ui.MMFGCollection;
import de.swa.ui.command.QueryByKeywordCommand;
import org.glassfish.jersey.server.ResourceConfig;
import software.amazon.awssdk.thirdparty.jackson.core.util.JacksonFeature;
import javax.activation.MimetypesFileTypeMap;
import javax.jws.WebMethod;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.File;
import java.util.Hashtable;
import java.util.UUID;
import java.util.Vector;

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
	/*
	*//** processes an asset with the GMAF Core and returns the calculated MMFG **//*
	public MMFG processAsset(String auth_token, @FormParam("file") File f) {
		try {
			return getSession(auth_token).processAsset(f);
		}
		catch (Exception x) {
			x.printStackTrace();
			errorMessages.put(auth_token, x.getMessage());
		}
		return null;
	}

	*//** processes an asset with the GMAF Core and returns the calculated MMFG **//*
	@WebMethod public MMFG processAsset(String auth_token, byte[] bytes, String suffix) {
		try {
			File f = File.createTempFile("gmaf", suffix);
			FileOutputStream fout = new FileOutputStream(f);
			fout.write(bytes);
			fout.flush();
			fout.close();
			return getSession(auth_token).processAsset(f);
		}
		catch (Exception x) {
			x.printStackTrace();
			errorMessages.put(auth_token, x.getMessage());
		}
		return null;
	}

	*//** processes an asset with the GMAF Core and returns the calculated MMFG **//*
	@POST
    @Path("/{process-asset}/{mmfg}")
	@Produces("application/json")
	public MMFG processAsset(@PathParam("auth-token") String auth_token, @PathParam("url") String surl) {
		try {
			URL url = new URL(surl);
			URLConnection uc = url.openConnection();
			byte[] bytes = uc.getInputStream().readAllBytes();
			String suffix = url.toString();
			suffix = suffix.substring(suffix.lastIndexOf(".") + 1, suffix.length());
			return processAsset(auth_token, bytes, suffix);
		}
		catch (Exception x) {
			x.printStackTrace();
			errorMessages.put(auth_token, x.getMessage());
		}
		return null;
	}

	*//** sets the classes of the processing plugins (optional) **//*
	@WebMethod public void setProcessingPlugins(String auth_token, Vector<String> plugins) {
		getSession(auth_token).setProcessingPlugins(plugins);
	}

	@POST
	@Path("/{query-by-example}")
	@Produces("application/json")
	@WebMethod public String[] queryByExample(@PathParam("auth-token") String auth_token, @PathParam("mmfg-id") String mmfg_id) {
		QueryByExampleCommand qbe = new QueryByExampleCommand(mmfg_id, auth_token);
		qbe.execute();
		return getCollectionIds(auth_token);
	}

	@POST
	@Path("/{query-by-sparql}")
	@Produces("application/json")
	@WebMethod public String[] queryBySPARQL(@PathParam("auth-token") String auth_token, @PathParam("query") String query) {
		QueryBySPARQLCommand qbs = new QueryBySPARQLCommand(query);
		qbs.setSessionId(auth_token);
		qbs.execute();
		return getCollectionIds(auth_token);
	}

	@POST
    @Path("/{get-last-error}")
	@Produces("application/json")
	@WebMethod public String getLastError(@PathParam("auth-token") String auth_token) {
		return errorMessages.get(auth_token);
	}*/
}