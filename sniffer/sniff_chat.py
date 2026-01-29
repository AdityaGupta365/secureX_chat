


import json
import os
from datetime import datetime
from pathlib import Path

from scapy.all import sniff, get_if_list, conf
from scapy.layers.inet import IP, TCP

PORT = int(os.getenv("SNIFF_PORT", 5000))
LOG_FILE = Path(__file__).with_name("packet_logs.json")

def process(pkt):
    if pkt.haslayer(IP) and pkt.haslayer(TCP):
        tcp_layer = pkt[TCP]
        ip_layer = pkt[IP]
        
        # Check if packet is related to our port
        if tcp_layer.sport == PORT or tcp_layer.dport == PORT:
            entry = {
                "ts": datetime.utcnow().isoformat() + "Z",
                "src": f"{ip_layer.src}:{tcp_layer.sport}",
                "dst": f"{ip_layer.dst}:{tcp_layer.dport}",
                "len": len(pkt),
                "flags": pkt.sprintf("%TCP.flags%"),
                "seq": tcp_layer.seq,
                "ack": tcp_layer.ack
            }
            
            print(f"📦 Packet captured: {entry}")
            
            # Ensure log file exists
            LOG_FILE.parent.mkdir(exist_ok=True)
            
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")

def main():
    print(f"🔍 Available network interfaces:")
    interfaces = get_if_list()
    for i, iface in enumerate(interfaces):
        print(f"  {i}: {iface}")
    
    print(f"\n🔍 Starting packet capture on port {PORT}...")
    print(f"📁 Log file: {LOG_FILE}")
    print(f"⚠️  Make sure to run as Administrator/root!")
    
    # Create log file immediately to test
    try:
        LOG_FILE.parent.mkdir(exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write("")  # Touch the file
        print(f"✅ Log file created successfully at: {LOG_FILE}")
    except Exception as e:
        print(f"❌ Failed to create log file: {e}")
        return
    
    # Try different capture approaches
    print("\n🚀 Trying different capture methods...")
    
    try:
        # Method 1: Try loopback interface first (most likely for localhost apps)
        print("📡 Method 1: Capturing on loopback interface...")
        sniff(
            iface="\\Device\\NPF_Loopback",  # Windows loopback
            filter=f"tcp port {PORT}",
            prn=process,
            store=0,
            timeout=10  # Test for 10 seconds first
        )
        
    except Exception as e:
        print(f"❌ Loopback capture failed: {e}")
        
        try:
            # Method 2: Try all interfaces
            print("📡 Method 2: Capturing on all interfaces...")
            sniff(
                filter=f"tcp port {PORT}",
                prn=process,
                store=0,
                timeout=10
            )
            
        except Exception as e2:
            print(f"❌ All interfaces capture failed: {e2}")
            
            try:
                # Method 3: Try with host filter for localhost
                print("📡 Method 3: Capturing localhost traffic specifically...")
                sniff(
                    filter=f"tcp port {PORT} and (host 127.0.0.1 or host localhost)",
                    prn=process,
                    store=0,
                    timeout=10
                )
                
            except Exception as e3:
                print(f"❌ All capture methods failed: {e3}")
                print("💡 Try running as Administrator or check if packets are actually being sent")
                return
    
    print("✅ Test capture completed. If no packets were captured, try making HTTP requests to your server.")
    print("🔄 Starting continuous capture...")
    
    # Start continuous capture after test
    try:
        sniff(
            iface="\\Device\\NPF_Loopback",
            filter=f"tcp port {PORT}",
            prn=process,
            store=0,
            count=0
        )
    except KeyboardInterrupt:
        print("\n🛑 Capture stopped by user")
    except Exception as e:
        print(f"❌ Continuous capture failed: {e}")

if __name__ == "__main__":
    main()