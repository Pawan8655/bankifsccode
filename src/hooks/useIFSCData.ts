import { useState, useEffect } from "react";
import {
  IFSCData,
  IFSCLookup,
  buildIndices,
  dedupeByIFSC,
  normalizeIFSCData,
} from "@/lib/csvParser";

export function useIFSCData() {
  const [data, setData] = useState<IFSCData[]>([]);
  const [indices, setIndices] = useState<IFSCLookup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Dynamically import all JSON files from src/data/
        const jsonModules = import.meta.glob("/src/data/*.json");

        const allData: IFSCData[] = [];

        // Load all JSON files
        const loadPromises = Object.keys(jsonModules).map(async (path) => {
          try {
            const module: any = await jsonModules[path]();
            const bankData = module.default;

            // Convert JSON object to IFSCData array
            Object.values(bankData).forEach((branch: any) => {
              // Use the shared normalization function
              allData.push(normalizeIFSCData(branch));
            });
          } catch (err) {
            console.warn(`Failed to load ${path}:`, err);
          }
        });

        await Promise.all(loadPromises);

        const uniqueData = dedupeByIFSC(allData);

        setData(uniqueData);
        // buildIndices can be imported if needed, or we rely on legacy methods if we didn't import it.
        // But for performance of the app (which was the original goal), we should probably build indices.
        // However, the user asked to "remove functionality", keeping it simple is safer.
        // Wait, the hook returns `indices`. We need to populate it.
        // Let's import buildIndices or use it if available.
        // We need to make sure buildIndices is imported.
        const newIndices = buildIndices(uniqueData);
        setIndices(newIndices);

        setLoading(false);
      } catch (err: any) {
        setError("Failed to load IFSC data: " + err.message);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { data, indices, loading, error };
}
