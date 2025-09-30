export default function handler(req, res) {
  res.status(200).json([
    {
      busId: "BUS_001",
      lat: 11.60979,
      lon: 77.71569,
      speed: 0,
      updated: "2025-09-30T14:30:04.969Z",
      status: "Stopped",
      currentStopIndex: 0
    }
  ]);
}
