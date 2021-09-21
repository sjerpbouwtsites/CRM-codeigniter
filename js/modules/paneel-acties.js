/**
 * @file de handelingen afkomstig vanuit het actie-paneel aan de rechterkant.
 */

import actiesInit from "./panelen/acties.js";
import configPaneelInit from "./panelen/config.js";
import filterInit from "./panelen/filter.js";

/**
 * initialisatie functie van alle acties die uit de navpanelen komen.
 */
export default function () {
	actiesInit();
	filterInit();
	configPaneelInit();
}

