import serial
import time

# Configuração da porta serial
porta_serial = serial.Serial('/dev/ttyUSB0', 115200)  # Substitua '/dev/ttyUSB0' pela porta serial correta da ESP32

# Aguarda um breve período para garantir que a porta serial esteja pronta
time.sleep(2)

# Envia o sinal para a ESP32
porta_serial.write(b'1')

# Aguarda a confirmação de recebimento da ESP32
time.sleep(2)

# Fecha a conexão da porta serial
porta_serial.close()
