## PACS and Worklist Server Front End

### Orthanc
---
- [RESTful API](https://orthanc.uclouvain.be/book/users/rest.html#list-all-the-dicom-resources)

Working:

# INR Portal - Admin Dashboard

Admin dashboard for managing DICOM modalities, accounts, software, and system monitoring in a medical PACS environment.

---

## Quick Start

### What You Need
- Node.js v18 or higher
- Orthanc DICOM Server v1.12.9 or higher
- Windows with PowerShell

### How to Run

**1. Clone and Install**
```bash
git clone https://github.com/Likhith-Yogesh/Front_end.git
cd Front_end
npm install
```

**2. Start Orthanc**

Open PowerShell as Administrator:
```powershell
cd "C:\Program Files\Orthanc Server"
.\Orthanc.exe CorsConfig.json
```

Leave this window open. Check http://localhost:8042 to confirm Orthanc is running.

**3. Start the App**

Open a new terminal:
```bash
cd C:\Development\Front_End
npm run dev
```

**4. Open in Browser**
```
http://localhost:5173
```

Login with any credentials (demo mode), then click "System Monitor" in the sidebar.

---

## Features

### System Monitor
- Create and manage DICOM modalities through Orthanc API
- Test device connectivity using DICOM C-ECHO
- View real-time connection status
- Edit and delete modality configurations
- Monitor browser performance metrics

### Other Sections
- Account management
- Administrator roles and permissions
- Software distribution tracking
- Data analytics and metrics
- PACS exam viewing

---

## Using System Monitor

### Creating a Modality

1. Click the green "Create Modality" button
2. Enter device information:
   - AET: Device identifier (e.g., E3D_TRACK_OR1)
   - Host: IP address (e.g., 192.168.1.100)
   - Port: Usually 4242
   - Manufacturer: Device manufacturer
3. Click "Create Modality"
4. Click "Refresh" to see your new device

### Testing Connectivity

1. Find your device card
2. Click the blue "Test" button
3. System performs C-ECHO test
4. Status updates to Online (green) or Offline (gray)
5. Response time is shown if connection succeeds

### Editing or Deleting

- Click yellow "Edit" button to modify settings
- Click red "Delete" button to remove a device

---

## Configuration Files

### Orthanc Setup (CorsConfig.json)

Create this file at `C:\Program Files\Orthanc Server\CorsConfig.json`:
```json
{
  "Name": "MyOrthanc",
  "HttpPort": 8042,
  "DicomPort": 4242,
  "DicomAet": "ORTHANC",
  "StorageDirectory": "C:\\Orthanc",
  "IndexDirectory": "C:\\Orthanc",
  "RemoteAccessAllowed": true,
  "AuthenticationEnabled": false,
  "HttpHeaders": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  },
  "Plugins": ["C:\\Program Files\\Orthanc Server\\Plugins"],
  "DicomModalities": {},
  "OrthancPeers": {}
}
```

### Vite Proxy (Already Configured)

The app uses a Vite proxy to communicate with Orthanc and avoid CORS issues. Configuration is in `vite.config.ts`.

---

## Common Issues

### Orthanc Won't Start

**Problem:** Port 4242 is already in use

**Fix:**
```powershell
netstat -ano | findstr :4242
taskkill /PID <number> /F
.\Orthanc.exe CorsConfig.json
```

### Can't Connect to Orthanc

**Checklist:**
- Is Orthanc running? Check the PowerShell window
- Can you access http://localhost:8042 in browser?
- Did you start Orthanc before the React app?

**Fix:** Restart both Orthanc and the React app

### C-ECHO Test Fails

This is normal if testing with devices that aren't actually on your network. For real devices:

- Verify device is powered on
- Check IP address is correct
- Ping the device to test network connectivity
- Ensure device accepts connections from "ORTHANC" AET
- Check firewall isn't blocking port 4242

---

## Tech Stack

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Lucide React for icons
- Orthanc DICOM server

---

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## Understanding DICOM Terms

**AET (Application Entity Title)**  
A unique name for a DICOM device. Think of it like a username. Maximum 16 characters.

**C-ECHO**  
A connectivity test for DICOM devices. Like pinging a server to see if it's online.

**Modality**  
Any medical imaging device or system (CT scanner, MRI, surgical navigation, etc.)

**PACS**  
Picture Archiving and Communication System. A medical image storage and management system.

---

## Project Context

Built for managing DICOM devices in the SPINE navigation system at Globus Medical. The system tracks surgical instruments during spinal procedures using E3D tracking, GPS navigation, and EHUB integration systems.

---

## Security Note

This configuration is for development and testing only. For production use:
- Enable authentication
- Use HTTPS with SSL certificates  
- Restrict remote access
- Review and harden all security settings
- Deploy behind VPN or firewall

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review Orthanc logs in the PowerShell window
3. Check browser console (F12) for errors
4. Verify network connectivity to devices
