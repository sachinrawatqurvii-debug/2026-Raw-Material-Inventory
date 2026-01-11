
import axios from "axios";
const fetchFabricDataFromGoogleSheet = async () => {
    try {
        const sheetId = "1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E";
        const apiKey = "AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs";
        const range = "Fabric Rate!A1:J";
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

        const response = await axios.get(url);

        const fabrics = [];

        for (let i = 1; i < response.data.values.length; i++) {
            const [
                fabric_number,
                fabric_rate,
                unit,
                length,
                fabric_name,
                vender,
                width,
                recieved_qty_meter,
                recieved_qty_kg,
                date
            ] = response.data.values[i];

            fabrics.push({
                fabric_number,
                fabric_rate,
                unit,
                length,
                fabric_name,
                vender,
                width,
                recieved_qty_meter,
                recieved_qty_kg,
                date
            });
        }

        return fabrics;
    } catch (error) {
        console.error("Failed to fetch fabric data from google sheet :: ", error?.message);
        throw error;
    }
};

export { fetchFabricDataFromGoogleSheet };
