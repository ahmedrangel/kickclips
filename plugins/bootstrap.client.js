import Tooltip from "bootstrap/js/dist/tooltip";

export default defineNuxtPlugin(() => {
    return {
        provide: { Tooltip }
    };
});