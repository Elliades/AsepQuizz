/**
 * Debug Utility
 * 
 * This utility provides debugging functions to help diagnose issues.
 */

/**
 * Logs the structure of an object to the console
 * 
 * @param obj The object to inspect
 * @param label Optional label for the log
 */
export const inspectObject = (obj: any, label?: string): void => {
  const prefix = label ? `${label}: ` : '';
  
  try {
    console.log(`${prefix}Object type: ${typeof obj}`);
    
    if (obj === null) {
      console.log(`${prefix}Object is null`);
      return;
    }
    
    if (obj === undefined) {
      console.log(`${prefix}Object is undefined`);
      return;
    }
    
    if (Array.isArray(obj)) {
      console.log(`${prefix}Array with ${obj.length} items`);
      if (obj.length > 0) {
        console.log(`${prefix}First item type: ${typeof obj[0]}`);
        console.log(`${prefix}First item:`, obj[0]);
      }
    } else if (typeof obj === 'object') {
      console.log(`${prefix}Object keys: ${Object.keys(obj).join(', ')}`);
    }
    
    console.log(`${prefix}Full object:`, obj);
  } catch (error) {
    console.error(`Error inspecting object: ${error}`);
  }
};

/**
 * Logs information about the current component rendering
 * 
 * @param componentName The name of the component
 * @param props The component props
 */
export const logComponentRender = (componentName: string, props: any): void => {
  console.log(`Rendering ${componentName} with props:`, props);
};

export default {
  inspectObject,
  logComponentRender
}; 