import axios from "axios";
import FormData from "form-data";

export const triggerKestraWorkflow = async (submission: any) => {
  try {
    if (!submission) {
      throw new Error("Submission data is missing or invalid.");
    }

    const namespace = "example";
    const flowId = "submission-processing";

    // Create a FormData object
    const formData = new FormData();
    
    // Instead of stringifying the whole submission, 
    // you might want to pass specific properties or a more structured input
    formData.append("submission", JSON.stringify({
      // Example: pass specific fields from submission
     submission
    }));

    // Send the request using axios with the correct headers
    const response = await axios.post(
      `http://localhost:8080/api/v1/executions/trigger/${namespace}/${flowId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Automatically sets the correct headers for multipart/form-data
        },
      }
    );

    return response.data.outputs;
  } catch (error: any) {
    console.error("Error triggering Kestra workflow:", error.message);
    throw error;
  }
};