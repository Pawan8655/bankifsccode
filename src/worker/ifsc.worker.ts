import { IFSCData, buildIndices, normalizeIFSCData } from "../lib/csvParser";

self.onmessage = async () => {
  try {
    // Vite processes this file, so import.meta.glob works
    const jsonModules = import.meta.glob("/src/data/*.json");
    const allData: IFSCData[] = [];

    const loadPromises = Object.keys(jsonModules).map(async (path) => {
      try {
        // dynamic import returns a module
        const module: any = await jsonModules[path]();
        const bankData = module.default;

        // bankData is values of expected object structure (based on useIFSCData logic)
        Object.values(bankData).forEach((branch: any) => {
          allData.push(normalizeIFSCData(branch));
        });
      } catch (err) {
        console.warn(`Failed to load ${path}:`, err);
      }
    });

    await Promise.all(loadPromises);

    // Build indices off-main-thread
    const indices = buildIndices(allData);

    // Post back results
    self.postMessage({ type: "SUCCESS", data: allData, indices });
  } catch (error: any) {
    self.postMessage({ type: "ERROR", error: error.message });
  }
};
