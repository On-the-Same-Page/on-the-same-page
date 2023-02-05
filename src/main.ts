import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {RootModule} from "./root/root.module";

platformBrowserDynamic().bootstrapModule(RootModule)
    .catch(err => console.error(err));
