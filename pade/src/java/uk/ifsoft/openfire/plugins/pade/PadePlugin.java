package uk.ifsoft.openfire.plugins.pade;

import org.jivesoftware.openfire.http.HttpBindManager;
import org.jivesoftware.openfire.XMPPServer;
import org.jivesoftware.openfire.container.Plugin;
import org.jivesoftware.openfire.container.PluginManager;
import org.jivesoftware.openfire.net.SASLAuthentication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.eclipse.jetty.apache.jsp.JettyJasperInitializer;
import org.eclipse.jetty.plus.annotation.ContainerInitializer;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.servlet.*;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.webapp.WebAppContext;

import org.eclipse.jetty.util.security.*;
import org.eclipse.jetty.security.*;
import org.eclipse.jetty.security.authentication.*;

import org.apache.tomcat.InstanceManager;
import org.apache.tomcat.SimpleInstanceManager;

import org.jivesoftware.openfire.plugin.rest.sasl.*;
import org.jivesoftware.openfire.plugin.rest.service.JerseyWrapper;
import org.jivesoftware.openfire.plugin.rest.OpenfireLoginService;

import java.io.File;
import java.util.*;
import java.security.Security;
import javax.servlet.DispatcherType;

import org.jitsi.util.OSUtils;
import waffle.servlet.NegotiateSecurityFilter;
import waffle.servlet.WaffleInfoServlet;




public class PadePlugin implements Plugin
{
    private static final Logger Log = LoggerFactory.getLogger( PadePlugin.class );

    private ServletContextHandler contextRest;
    private WebAppContext contextPublic;
    private WebAppContext contextPrivate;
    private WebAppContext contextWinSSO;

    /**
     * Initializes the plugin.
     *
     * @param manager         the plugin manager.
     * @param pluginDirectory the directory where the plugin is located.
     */
    @Override
    public void initializePlugin( final PluginManager manager, final File pluginDirectory )
    {
        Log.info("start pade server");

        contextRest = new ServletContextHandler(null, "/rest", ServletContextHandler.SESSIONS);
        contextRest.setClassLoader(this.getClass().getClassLoader());
        contextRest.addServlet(new ServletHolder(new JerseyWrapper()), "/api/*");
        HttpBindManager.getInstance().addJettyHandler(contextRest);

        contextPrivate = new WebAppContext(null, pluginDirectory.getPath() + "/classes/private", "/dashboard");
        contextPrivate.setClassLoader(this.getClass().getClassLoader());
        SecurityHandler securityHandler = basicAuth("ofmeet");
        contextPrivate.setSecurityHandler(securityHandler);
        final List<ContainerInitializer> initializersDashboard = new ArrayList<>();
        initializersDashboard.add(new ContainerInitializer(new JettyJasperInitializer(), null));
        contextPrivate.setAttribute("org.eclipse.jetty.containerInitializers", initializersDashboard);
        contextPrivate.setAttribute(InstanceManager.class.getName(), new SimpleInstanceManager());
        contextPrivate.setWelcomeFiles(new String[]{"index.jsp"});
        HttpBindManager.getInstance().addJettyHandler(contextPrivate);

        contextPublic = new WebAppContext(null, pluginDirectory.getPath() + "/classes/public", "/apps");
        contextPublic.setClassLoader(this.getClass().getClassLoader());
        final List<ContainerInitializer> initializersCRM = new ArrayList<>();
        initializersCRM.add(new ContainerInitializer(new JettyJasperInitializer(), null));
        contextPublic.setAttribute("org.eclipse.jetty.containerInitializers", initializersCRM);
        contextPublic.setAttribute(InstanceManager.class.getName(), new SimpleInstanceManager());
        contextPublic.setWelcomeFiles(new String[]{"index.html"});
        HttpBindManager.getInstance().addJettyHandler(contextPublic);

        if (OSUtils.IS_WINDOWS)
        {
            contextWinSSO = new WebAppContext(null, pluginDirectory.getPath() + "/classes/win-sso", "/sso");
            contextWinSSO.setClassLoader(this.getClass().getClassLoader());

            final List<ContainerInitializer> initializers7 = new ArrayList<>();
            initializers7.add(new ContainerInitializer(new JettyJasperInitializer(), null));
            contextWinSSO.setAttribute("org.eclipse.jetty.containerInitializers", initializers7);
            contextWinSSO.setAttribute(InstanceManager.class.getName(), new SimpleInstanceManager());
            contextWinSSO.setWelcomeFiles(new String[]{"index.jsp"});

            NegotiateSecurityFilter securityFilter = new NegotiateSecurityFilter();
            FilterHolder filterHolder = new FilterHolder();
            filterHolder.setFilter(securityFilter);
            EnumSet<DispatcherType> enums = EnumSet.of(DispatcherType.REQUEST);
            enums.add(DispatcherType.REQUEST);

            contextWinSSO.addFilter(filterHolder, "/*", enums);
            contextWinSSO.addServlet(new ServletHolder(new WaffleInfoServlet()), "/waffle");
            contextWinSSO.addServlet(new ServletHolder(new org.ifsoft.sso.Password()), "/password");
            HttpBindManager.getInstance().addJettyHandler(contextWinSSO);
        }

        try
        {
            Security.addProvider( new OfChatSaslProvider() );
            SASLAuthentication.addSupportedMechanism( OfChatSaslServer.MECHANISM_NAME );
        }
        catch ( Exception ex )
        {
            Log.error( "An exception occurred", ex );
        }
    }

    /**
     * Destroys the plugin.<p>
     * <p>
     * Implementations of this method must release all resources held
     * by the plugin such as file handles, database or network connections,
     * and references to core Openfire classes. In other words, a
     * garbage collection executed after this method is called must be able
     * to clean up all plugin classes.
     */
    @Override
    public void destroyPlugin()
    {
        Log.info("stop pade server");

        try {
            SASLAuthentication.removeSupportedMechanism( OfChatSaslServer.MECHANISM_NAME );
            Security.removeProvider( OfChatSaslProvider.NAME );
        } catch (Exception e) {}

        HttpBindManager.getInstance().removeJettyHandler(contextRest);
        HttpBindManager.getInstance().removeJettyHandler(contextPublic);
        HttpBindManager.getInstance().removeJettyHandler(contextPrivate);

        if (contextWinSSO != null) HttpBindManager.getInstance().removeJettyHandler(contextWinSSO);
    }

    private static final SecurityHandler basicAuth(String realm) {

        OpenfireLoginService l = new OpenfireLoginService(realm);
        Constraint constraint = new Constraint();
        constraint.setName(Constraint.__BASIC_AUTH);
        constraint.setRoles(new String[]{"ofmeet", "webapp-owner", "webapp-contributor", "warfile-admin"});
        constraint.setAuthenticate(true);

        ConstraintMapping cm = new ConstraintMapping();
        cm.setConstraint(constraint);
        cm.setPathSpec("/*");

        ConstraintSecurityHandler csh = new ConstraintSecurityHandler();
        csh.setAuthenticator(new BasicAuthenticator());
        csh.setRealmName(realm);
        csh.addConstraintMapping(cm);
        csh.setLoginService(l);

        return csh;
    }
}
