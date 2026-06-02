import axios from "axios";
import { getFunctionUrl } from "./functionUrls";


export const roadmapService = {
  generate: async (role, level) => {
    try {
      const url = getFunctionUrl("generateRoadmap");
      const response = await axios.post(url, { role, level });
      const apiData = response.data.data;
      
      return {
        id: 'rm_' + Date.now(),
        role,
        level,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        salary: apiData.salary || '$130k',
        growth: apiData.growth || '+15%',
        scarcity: apiData.scarcity || 'High',
        timeToRole: apiData.timeToRole || '~6mo',
        stages: apiData.stages.map((s, idx) => ({
          ...s,
          id: `rm_stage_${idx}_` + Date.now()
        }))
      };
    } catch (err) {
      console.error("Roadmap API synthesis failed:", err);
      throw err;
    }
  }
};
