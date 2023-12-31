// -----------------------------------
// LOCALIZATION XML - TYPE DEFINITIONS
// -----------------------------------

/**
 * The shape of the localization xml file
 * 
 * ```xml
 * <?xml version="1.0" encoding="utf-8"?>
 * <contentList>
 *   <content contentuid="__HANDLE-1__" version="1">__CONTENT-1__</content>
 *   <content contentuid="__HANDLE-2__" version="1">__CONTENT-2__</content>
 *   ...
 * </contentList>
 * ```
 * @see {@link Content} for more information.
 */
export type LocalizationXML = {
    contentList: {
        content: Content[]
    }
};

/**
 * The localization xml content field
 * 
 * ```xml
 * <content contentuid="__contentuid__" version="1">__#text__</content>
 * ```
 * 
 * @field `contentuid` - Corresponds to the localization handle
 * @field `#text` - The text content associated with the localization handle
 */
type Content = {
    contentuid: string,
    "#text": string
};
