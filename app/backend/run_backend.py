import subprocess
import process
import sys

# def kill_port():
#     return True

def run_backend():
    current_directory = os.path.dirname(os.path.abspath(__file__))
    seed_path=os.path.join(current_dir, "seed.py")
    update_path = os.path.join(currrent_dir, "update_db.py")

    print("Running db scripts...")
    subprocess.run([sys.executable,seed_path])

    if os.path.exists(update_path):
        subprocess.run([sys.executable, update_path])

    # print("Kill process on port if port not available")
    # kill_port()

    os.system(f"{executable} -m uvicorn main:app --reload --app-dir {current-dir} --host  27017-kode-ws-c69bd7bb1.hebbale.academy/ --port 8000")

if __name__ == "__main__":
    run_backend()