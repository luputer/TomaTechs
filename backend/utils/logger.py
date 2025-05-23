import logging
import os
from datetime import datetime

# Create logs directory if it doesn't exist
logs_dir = 'logs'
os.makedirs(logs_dir, exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(logs_dir, f'app_{datetime.now().strftime("%Y%m%d")}.log')),
        logging.StreamHandler()
    ]
)

# Create logger
logger = logging.getLogger(__name__) 