import * as SIP from "sip.js";
import { CallOptions, TransportOptions, AfricasTalkingClassOptions, AfricasTalkingConfig } from "@/types";


export class AfricasTalking implements AfricasTalkingClassOptions {
    
    public options: AfricasTalkingConfig;

    public initialized: boolean = false;

    public userAgent?: SIP.UserAgent;

    constructor(options: AfricasTalkingConfig) {
        this.options = options;
        this.initialize();
    }

    public initialize = async () => {

        const transportOptions: TransportOptions = {
            server: `wss://${this.options.webSocket}`
        }

        const sipConfig: SIP.UserAgentOptions = {
            uri: SIP.UserAgent.makeURI(`sip:${this.options.username}@${this.options.domain}`),
            transportOptions: transportOptions,
            authorizationUsername: this.options.username,
            authorizationPassword: this.options.apiKey,
            contactParams: { "transport" : "wss"},
            contactName: "MG VoIP",
            displayName: "MG VoIP",
            viaHost: `${this.options.domain}`
        };

        // setup user agent
        const userAgent = new SIP.UserAgent(sipConfig);
        // setup registerer
        const registerer = new SIP.Registerer(userAgent);

        console.log(userAgent);

        // Initialize
        // await userAgent.start();
        //registerer.register();

        //this.userAgent = userAgent;
        //this.initialized = true;
    };

    public makeCall = (options: CallOptions): Promise<SIP.Core.OutgoingInviteRequest | null> => {
        const target = SIP.UserAgent.makeURI("sip:bob@example.com");
        if (this.userAgent) {
            const inviter = new SIP.Inviter(this.userAgent, target!);
            // If initialized, make calls
            const session = inviter.invite();

            return session;
        }

        return null! as Promise<SIP.Core.OutgoingInviteRequest | null>;
    }
}