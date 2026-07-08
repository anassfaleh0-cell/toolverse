import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: `Common Port Numbers — Complete Reference | ${SITE_NAME}`,
  description: `Reference of well-known TCP and UDP port numbers organized by service category. Includes ports for web, email, file transfer, database, security, and more.`,
  alternates: { canonical: `${SITE_URL}/port-numbers` },
  openGraph: {
    title: `Common Port Numbers Reference — ${SITE_NAME}`,
    description: `Well-known TCP/UDP port numbers organized by service category. Over 50 common ports listed.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Port Numbers" },
];

interface PortEntry {
  port: number;
  protocol: string;
  service: string;
  description: string;
  category: string;
}

const PORTS: PortEntry[] = [
  { port: 20, protocol: "TCP", service: "FTP Data", description: "File Transfer Protocol data transfer channel.", category: "File Transfer" },
  { port: 21, protocol: "TCP", service: "FTP Control", description: "File Transfer Protocol command and control channel.", category: "File Transfer" },
  { port: 22, protocol: "TCP", service: "SSH", description: "Secure Shell for encrypted remote access, SFTP, and SCP.", category: "Remote Access" },
  { port: 23, protocol: "TCP", service: "Telnet", description: "Unencrypted remote terminal access (legacy, insecure).", category: "Remote Access" },
  { port: 25, protocol: "TCP", service: "SMTP", description: "Simple Mail Transfer Protocol for sending outgoing email.", category: "Email" },
  { port: 53, protocol: "TCP/UDP", service: "DNS", description: "Domain Name System queries and zone transfers.", category: "Network Services" },
  { port: 67, protocol: "UDP", service: "DHCP Server", description: "Dynamic Host Configuration Protocol server (address allocation).", category: "Network Services" },
  { port: 68, protocol: "UDP", service: "DHCP Client", description: "Dynamic Host Configuration Protocol client (address request).", category: "Network Services" },
  { port: 69, protocol: "UDP", service: "TFTP", description: "Trivial File Transfer Protocol (simple, no authentication).", category: "File Transfer" },
  { port: 80, protocol: "TCP", service: "HTTP", description: "Hypertext Transfer Protocol for serving web pages.", category: "Web" },
  { port: 88, protocol: "TCP/UDP", service: "Kerberos", description: "Network authentication protocol.", category: "Security" },
  { port: 110, protocol: "TCP", service: "POP3", description: "Post Office Protocol v3 for receiving email (downloads messages locally).", category: "Email" },
  { port: 111, protocol: "TCP/UDP", service: "RPC Portmapper", description: "Sun RPC port mapper for NFS and other RPC services.", category: "Network Services" },
  { port: 119, protocol: "TCP", service: "NNTP", description: "Network News Transfer Protocol for Usenet newsgroups.", category: "Legacy" },
  { port: 123, protocol: "UDP", service: "NTP", description: "Network Time Protocol for time synchronization.", category: "Network Services" },
  { port: 135, protocol: "TCP/UDP", service: "RPC Endpoint Mapper", description: "Microsoft RPC endpoint mapper (DCOM).", category: "Windows" },
  { port: 137, protocol: "UDP", service: "NetBIOS Name", description: "NetBIOS name resolution on Windows networks.", category: "Windows" },
  { port: 139, protocol: "TCP", service: "NetBIOS Session", description: "NetBIOS session service (legacy file sharing).", category: "Windows" },
  { port: 143, protocol: "TCP", service: "IMAP", description: "Internet Message Access Protocol (keeps messages on server).", category: "Email" },
  { port: 161, protocol: "UDP", service: "SNMP", description: "Simple Network Management Protocol for device monitoring.", category: "Network Services" },
  { port: 162, protocol: "UDP", service: "SNMP Trap", description: "SNMP trap notifications from network devices.", category: "Network Services" },
  { port: 179, protocol: "TCP", service: "BGP", description: "Border Gateway Protocol for internet routing between ASNs.", category: "Routing" },
  { port: 389, protocol: "TCP/UDP", service: "LDAP", description: "Lightweight Directory Access Protocol for directory services.", category: "Directory Services" },
  { port: 443, protocol: "TCP", service: "HTTPS", description: "HTTP over TLS/SSL for secure web browsing.", category: "Web" },
  { port: 445, protocol: "TCP", service: "SMB", description: "Server Message Block for Windows file and printer sharing.", category: "Windows" },
  { port: 465, protocol: "TCP", service: "SMTPS", description: "SMTP over SSL (deprecated — use STARTTLS on port 587).", category: "Email" },
  { port: 500, protocol: "UDP", service: "IKE", description: "Internet Key Exchange for IPsec VPNs.", category: "Security" },
  { port: 514, protocol: "UDP", service: "Syslog", description: "System logging protocol for network device logs.", category: "Network Services" },
  { port: 520, protocol: "UDP", service: "RIP", description: "Routing Information Protocol for interior gateway routing.", category: "Routing" },
  { port: 546, protocol: "UDP", service: "DHCPv6 Client", description: "DHCP for IPv6 client port.", category: "Network Services" },
  { port: 547, protocol: "UDP", service: "DHCPv6 Server", description: "DHCP for IPv6 server port.", category: "Network Services" },
  { port: 554, protocol: "TCP/UDP", service: "RTSP", description: "Real Time Streaming Protocol for media streaming control.", category: "Media" },
  { port: 587, protocol: "TCP", service: "SMTP Submission", description: "SMTP with STARTTLS for email submission from clients.", category: "Email" },
  { port: 593, protocol: "TCP/UDP", service: "HTTP RPC", description: "Microsoft DCOM over HTTP.", category: "Windows" },
  { port: 631, protocol: "TCP/UDP", service: "IPP", description: "Internet Printing Protocol for modern network printing.", category: "Printing" },
  { port: 636, protocol: "TCP", service: "LDAPS", description: "LDAP over SSL/TLS for secure directory services.", category: "Directory Services" },
  { port: 993, protocol: "TCP", service: "IMAPS", description: "IMAP over SSL/TLS for secure email access.", category: "Email" },
  { port: 995, protocol: "TCP", service: "POP3S", description: "POP3 over SSL/TLS for secure email download.", category: "Email" },
  { port: 1080, protocol: "TCP", service: "SOCKS Proxy", description: "SOCKS protocol for proxy connections.", category: "Proxy" },
  { port: 1194, protocol: "UDP", service: "OpenVPN", description: "OpenVPN virtual private network port.", category: "Security" },
  { port: 1433, protocol: "TCP", service: "MSSQL", description: "Microsoft SQL Server default database port.", category: "Database" },
  { port: 1521, protocol: "TCP", service: "Oracle DB", description: "Oracle Database listener default port.", category: "Database" },
  { port: 1701, protocol: "UDP", service: "L2TP", description: "Layer 2 Tunneling Protocol for VPNs.", category: "Security" },
  { port: 1723, protocol: "TCP", service: "PPTP", description: "Point-to-Point Tunneling Protocol (legacy VPN, insecure).", category: "Security" },
  { port: 1812, protocol: "UDP", service: "RADIUS Auth", description: "RADIUS authentication protocol.", category: "Security" },
  { port: 1813, protocol: "UDP", service: "RADIUS Acct", description: "RADIUS accounting protocol.", category: "Security" },
  { port: 2049, protocol: "TCP/UDP", service: "NFS", description: "Network File System for remote file access.", category: "File Sharing" },
  { port: 2082, protocol: "TCP", service: "cPanel", description: "cPanel web hosting control panel (non-SSL).", category: "Applications" },
  { port: 2083, protocol: "TCP", service: "cPanel SSL", description: "cPanel over SSL/TLS.", category: "Applications" },
  { port: 2181, protocol: "TCP", service: "ZooKeeper", description: "Apache ZooKeeper client port for distributed coordination.", category: "Applications" },
  { port: 2375, protocol: "TCP", service: "Docker REST", description: "Docker REST API (plain HTTP — not secure).", category: "Applications" },
  { port: 2376, protocol: "TCP", service: "Docker TLS", description: "Docker REST API over TLS.", category: "Applications" },
  { port: 2379, protocol: "TCP", service: "etcd Client", description: "etcd distributed key-value store client port.", category: "Applications" },
  { port: 2380, protocol: "TCP", service: "etcd Peer", description: "etcd peer-to-peer communication for cluster consensus.", category: "Applications" },
  { port: 2483, protocol: "TCP", service: "Oracle DB TLS", description: "Oracle Database with TLS/SSL.", category: "Database" },
  { port: 3000, protocol: "TCP", service: "Dev Server", description: "Common dev server port (Rails, Node.js, Django, React).", category: "Development" },
  { port: 3128, protocol: "TCP", service: "Squid Proxy", description: "Squid caching web proxy default port.", category: "Proxy" },
  { port: 3260, protocol: "TCP", service: "iSCSI", description: "Internet Small Computer System Interface for storage networking.", category: "Storage" },
  { port: 3306, protocol: "TCP", service: "MySQL", description: "MySQL database server default port.", category: "Database" },
  { port: 3389, protocol: "TCP/UDP", service: "RDP", description: "Remote Desktop Protocol for Windows remote desktop access.", category: "Remote Access" },
  { port: 3478, protocol: "TCP/UDP", service: "STUN/TURN", description: "Session Traversal Utilities for NAT and relay for WebRTC.", category: "Network Services" },
  { port: 3689, protocol: "TCP", service: "DAAP", description: "Digital Audio Access Protocol (Apple iTunes sharing).", category: "Media" },
  { port: 3690, protocol: "TCP", service: "SVN", description: "Apache Subversion version control.", category: "Development" },
  { port: 4000, protocol: "TCP", service: "Node.js Dev", description: "Common Node.js development server port.", category: "Development" },
  { port: 4222, protocol: "TCP", service: "NATS", description: "NATS messaging system client port.", category: "Messaging" },
  { port: 4500, protocol: "UDP", service: "IPsec NAT-T", description: "IPsec NAT traversal (allows IPsec through NAT).", category: "Security" },
  { port: 4567, protocol: "TCP", service: "Sinatra Dev", description: "Sinatra/Ruby development server common port.", category: "Development" },
  { port: 4569, protocol: "UDP", service: "IAX2", description: "Inter-Asterisk eXchange v2 for VoIP PBX communications.", category: "VoIP" },
  { port: 4848, protocol: "TCP", service: "GlassFish", description: "GlassFish application server admin console.", category: "Applications" },
  { port: 5000, protocol: "TCP", service: "Flask Dev", description: "Common Flask Python development server.", category: "Development" },
  { port: 5060, protocol: "TCP/UDP", service: "SIP", description: "Session Initiation Protocol for VoIP call signaling.", category: "VoIP" },
  { port: 5061, protocol: "TCP", service: "SIP TLS", description: "SIP over TLS for encrypted VoIP signaling.", category: "VoIP" },
  { port: 5143, protocol: "TCP", service: "Netlogon", description: "Microsoft Netlogon remote protocol.", category: "Windows" },
  { port: 5222, protocol: "TCP", service: "XMPP Client", description: "Extensible Messaging and Presence Protocol client-to-server.", category: "Messaging" },
  { port: 5269, protocol: "TCP", service: "XMPP Server", description: "XMPP server-to-server federation.", category: "Messaging" },
  { port: 5349, protocol: "TCP", service: "STUN TLS", description: "STUN/TURN over TLS for secure WebRTC.", category: "Network Services" },
  { port: 5432, protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL database server default port.", category: "Database" },
  { port: 5555, protocol: "TCP", service: "Android ADB", description: "Android Debug Bridge over network.", category: "Development" },
  { port: 5601, protocol: "TCP", service: "Kibana", description: "Kibana data visualization dashboard for Elastic Stack.", category: "Monitoring" },
  { port: 5672, protocol: "TCP", service: "AMQP", description: "Advanced Message Queuing Protocol (RabbitMQ, ActiveMQ).", category: "Messaging" },
  { port: 5683, protocol: "UDP", service: "CoAP", description: "Constrained Application Protocol for IoT devices.", category: "IoT" },
  { port: 5800, protocol: "TCP", service: "VNC HTTP", description: "VNC remote desktop over HTTP (Java client).", category: "Remote Access" },
  { port: 5900, protocol: "TCP", service: "VNC", description: "Virtual Network Computing for remote desktop access.", category: "Remote Access" },
  { port: 5984, protocol: "TCP", service: "CouchDB", description: "Apache CouchDB database port.", category: "Database" },
  { port: 5985, protocol: "TCP", service: "WinRM HTTP", description: "Windows Remote Management over HTTP.", category: "Windows" },
  { port: 5986, protocol: "TCP", service: "WinRM HTTPS", description: "Windows Remote Management over HTTPS.", category: "Windows" },
  { port: 6000, protocol: "TCP", service: "X11", description: "X Window System display server for remote GUI applications.", category: "Legacy" },
  { port: 6379, protocol: "TCP", service: "Redis", description: "Redis in-memory data structure store.", category: "Database" },
  { port: 6443, protocol: "TCP", service: "Kubernetes API", description: "Kubernetes API server over TLS.", category: "Applications" },
  { port: 6667, protocol: "TCP", service: "IRC", description: "Standard Internet Relay Chat port.", category: "Messaging" },
  { port: 6697, protocol: "TCP", service: "IRC TLS", description: "IRC over TLS (standard secure IRC).", category: "Messaging" },
  { port: 6881, protocol: "TCP/UDP", service: "BitTorrent", description: "BitTorrent peer-to-peer file sharing tracker port.", category: "File Sharing" },
  { port: 8000, protocol: "TCP", service: "Dev HTTP", description: "Common development HTTP server (Python, Ruby, Node.js).", category: "Development" },
  { port: 8008, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP port for web services.", category: "Web" },
  { port: 8009, protocol: "TCP", service: "Tomcat AJP", description: "Apache Tomcat AJP connector for reverse proxy integration.", category: "Applications" },
  { port: 8080, protocol: "TCP", service: "HTTP Proxy", description: "Common alternative HTTP port (Tomcat, Jenkins, proxies).", category: "Web" },
  { port: 8086, protocol: "TCP", service: "InfluxDB", description: "InfluxDB time-series database HTTP API.", category: "Database" },
  { port: 8089, protocol: "TCP", service: "Splunk", description: "Splunk web interface and management port.", category: "Applications" },
  { port: 8096, protocol: "TCP", service: "Emby Server", description: "Emby media server web interface.", category: "Media" },
  { port: 8111, protocol: "TCP", service: "JIRA", description: "Atlassian JIRA project management (default HTTP).", category: "Applications" },
  { port: 8140, protocol: "TCP", service: "Puppet", description: "Puppet configuration management agent port.", category: "Applications" },
  { port: 8200, protocol: "TCP", service: "Vault HTTP", description: "HashiCorp Vault HTTP API.", category: "Security" },
  { port: 8300, protocol: "TCP", service: "Consul Server", description: "HashiCorp Consul server RPC port.", category: "Applications" },
  { port: 8384, protocol: "TCP", service: "Syncthing GUI", description: "Syncthing web admin interface.", category: "File Sharing" },
  { port: 8403, protocol: "TCP", service: "CommVault", description: "CommVault data backup management.", category: "Applications" },
  { port: 8443, protocol: "TCP", service: "HTTPS Alt", description: "Alternative HTTPS port for secure admin consoles (Tomcat, Jenkins).", category: "Web" },
  { port: 8500, protocol: "TCP", service: "Consul DNS", description: "HashiCorp Consul DNS interface.", category: "Applications" },
  { port: 8600, protocol: "TCP", service: "Consul HTTP", description: "HashiCorp Consul HTTP API.", category: "Applications" },
  { port: 8761, protocol: "TCP", service: "Eureka", description: "Netflix Eureka service discovery (Spring Cloud).", category: "Applications" },
  { port: 8834, protocol: "TCP", service: "Nessus", description: "Nessus vulnerability scanner web interface.", category: "Security" },
  { port: 8843, protocol: "TCP", service: "UniFi TLS", description: "Ubiquiti UniFi controller TLS port.", category: "Applications" },
  { port: 8883, protocol: "TCP", service: "MQTT TLS", description: "MQTT messaging over TLS for IoT.", category: "IoT" },
  { port: 8888, protocol: "TCP", service: "Jupyter", description: "Jupyter Notebook/Lab web interface (default).", category: "Development" },
  { port: 9000, protocol: "TCP", service: "Portainer", description: "Portainer container management web interface.", category: "Applications" },
  { port: 9042, protocol: "TCP", service: "Cassandra", description: "Apache Cassandra CQL native transport.", category: "Database" },
  { port: 9090, protocol: "TCP", service: "Prometheus", description: "Prometheus monitoring and alerting toolkit.", category: "Monitoring" },
  { port: 9092, protocol: "TCP", service: "Kafka", description: "Apache Kafka distributed streaming broker.", category: "Messaging" },
  { port: 9100, protocol: "TCP", service: "Node Exporter", description: "Prometheus Node Exporter for system metrics.", category: "Monitoring" },
  { port: 9200, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch REST API (HTTP).", category: "Database" },
  { port: 9300, protocol: "TCP", service: "Elasticsearch Node", description: "Elasticsearch inter-node transport protocol.", category: "Database" },
  { port: 9418, protocol: "TCP", service: "Git", description: "Git version control protocol (smart HTTP).", category: "Development" },
  { port: 9993, protocol: "TCP/UDP", service: "ZeroTier", description: "ZeroTier virtual network controller.", category: "Security" },
  { port: 10000, protocol: "TCP", service: "Webmin", description: "Webmin system administration web interface.", category: "Applications" },
  { port: 10050, protocol: "TCP", service: "Zabbix Agent", description: "Zabbix monitoring agent port.", category: "Monitoring" },
  { port: 10051, protocol: "TCP", service: "Zabbix Server", description: "Zabbix monitoring server trapper port.", category: "Monitoring" },
  { port: 11211, protocol: "TCP/UDP", service: "Memcached", description: "Memcached distributed memory caching system.", category: "Database" },
  { port: 11434, protocol: "TCP", service: "Ollama", description: "Ollama local LLM server API.", category: "Development" },
  { port: 15672, protocol: "TCP", service: "RabbitMQ UI", description: "RabbitMQ management web UI.", category: "Messaging" },
  { port: 16113, protocol: "TCP", service: "NetIQ", description: "NetIQ security agent.", category: "Security" },
  { port: 17030, protocol: "TCP", service: "Folding@Home", description: "Folding@Home distributed computing.", category: "Applications" },
  { port: 17500, protocol: "TCP", service: "Dropbox", description: "Dropbox LAN sync protocol.", category: "File Sharing" },
  { port: 19132, protocol: "UDP", service: "Minecraft", description: "Minecraft Java Edition server (default).", category: "Gaming" },
  { port: 19999, protocol: "TCP", service: "Netdata", description: "Netdata real-time system monitoring dashboard.", category: "Monitoring" },
  { port: 20000, protocol: "TCP", service: "DNP", description: "Distributed Network Protocol (SCADA).", category: "IoT" },
  { port: 20583, protocol: "TCP", service: "VirtualBox VRDP", description: "VirtualBox remote display protocol.", category: "Applications" },
  { port: 22000, protocol: "TCP", service: "Syncthing", description: "Syncthing peer-to-peer transfer.", category: "File Sharing" },
  { port: 22222, protocol: "TCP", service: "cPanel SSL", description: "cPanel web hosting control panel (alternative SSL).", category: "Applications" },
  { port: 24224, protocol: "TCP", service: "Fluentd", description: "Fluentd log forwarder/aggregator.", category: "Monitoring" },
  { port: 24800, protocol: "TCP", service: "Synergy", description: "Synergy keyboard/mouse sharing across computers.", category: "Applications" },
  { port: 25565, protocol: "TCP", service: "Minecraft", description: "Minecraft Java Edition game server (default).", category: "Gaming" },
  { port: 25826, protocol: "UDP", service: "Collectd", description: "Collectd system statistics daemon.", category: "Monitoring" },
  { port: 26379, protocol: "TCP", service: "Redis Sentinel", description: "Redis Sentinel for high availability monitoring.", category: "Database" },
  { port: 27015, protocol: "TCP/UDP", service: "Steam", description: "Valve Steam game server (HL, CS, TF2).", category: "Gaming" },
  { port: 27017, protocol: "TCP", service: "MongoDB", description: "MongoDB database server (default).", category: "Database" },
  { port: 28015, protocol: "TCP/UDP", service: "Rust", description: "Rust game server port.", category: "Gaming" },
  { port: 30303, protocol: "TCP/UDP", service: "Ethereum", description: "Ethereum blockchain peer-to-peer networking.", category: "Applications" },
  { port: 31337, protocol: "TCP", service: "Back Orifice", description: "Back Orifice remote admin (malware trojan).", category: "Security" },
  { port: 32400, protocol: "TCP", service: "Plex", description: "Plex Media Server web access.", category: "Media" },
  { port: 33060, protocol: "TCP", service: "MySQL X DevAPI", description: "MySQL X Protocol for document store operations.", category: "Database" },
  { port: 33434, protocol: "UDP", service: "Traceroute", description: "Traceroute default base UDP port.", category: "Network Services" },
  { port: 34197, protocol: "UDP", service: "Factorio", description: "Factorio game server port.", category: "Gaming" },
  { port: 44158, protocol: "TCP/UDP", service: "Helium", description: "Helium LoRaWAN hotspot networking.", category: "IoT" },
  { port: 47001, protocol: "TCP", service: "WinRM", description: "Windows Remote Management PowerShell.", category: "Windows" },
  { port: 49152, protocol: "TCP/UDP", service: "Dynamic Start", description: "Start of dynamic/private/ephemeral port range (IANA).", category: "System" },
  { port: 50070, protocol: "TCP", service: "Hadoop NameNode", description: "Hadoop HDFS NameNode web UI.", category: "Applications" },
  { port: 50075, protocol: "TCP", service: "Hadoop DataNode", description: "Hadoop HDFS DataNode web UI.", category: "Applications" },
  { port: 51413, protocol: "TCP/UDP", service: "BitTorrent DHT", description: "BitTorrent DHT and PEX networking.", category: "File Sharing" },
  { port: 61616, protocol: "TCP", service: "ActiveMQ", description: "Apache ActiveMQ message broker.", category: "Messaging" },
  { port: 65535, protocol: "TCP/UDP", service: "Reserved", description: "Last port number in the 16-bit port range.", category: "System" },
];

const categoryOrder = ["Web", "Email", "File Transfer", "Remote Access", "Database", "Security", "Network Services", "Windows", "Messaging", "VoIP", "Routing", "Directory Services", "Proxy", "Monitoring", "Applications", "Development", "File Sharing", "Media", "IoT", "Gaming", "Printing", "Storage", "Legacy", "System"];

export default function PortNumbersPage() {
  const grouped = categoryOrder.reduce<Record<string, PortEntry[]>>((acc, cat) => {
    const ports = PORTS.filter((p) => p.category === cat);
    if (ports.length > 0) acc[cat] = ports;
    return acc;
  }, {});

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Common Port Numbers Reference — ${SITE_NAME}`, description: `Well-known TCP/UDP port numbers organized by service category.`, url: `${SITE_URL}/port-numbers`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Port Numbers
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Reference of well-known TCP and UDP port numbers organized by service category. Includes 150+ common ports from well-known (0-1023) and registered ranges.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {Object.entries(grouped).map(([cat, ports]) => (
            <div key={cat} className="mb-12 last:mb-0">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{cat}</h2>
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                      <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Port</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Protocol</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Service</th>
                      <th className="hidden px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50 md:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {ports.map((entry) => (
                      <tr key={`${entry.port}-${entry.protocol}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <td className="px-4 py-3 font-mono text-base font-bold text-zinc-900 dark:text-zinc-50">{entry.port}</td>
                        <td className="px-4 py-3">
                          <Badge variant="neutral">{entry.protocol}</Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">{entry.service}</td>
                        <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">{entry.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <Card variant="default" className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Need to check if a port is open?</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Use our <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Port Checker</Link> tool to test if a TCP port is open on any host.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
