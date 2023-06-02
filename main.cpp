#include <Arduino.h>

const int led = 12;    // Pino do LED 
const int lockPin = 14;        // Pino da fechadura

void setup() {
  pinMode(led, OUTPUT);
  pinMode(lockPin, OUTPUT);

  // Inicialmente, desliga o LED e a fechadura
  digitalWrite(led, LOW);
  digitalWrite(lockPin, LOW);

  // Inicia a comunicação serial
  Serial.begin(115200);
}

void loop() {
  if (Serial.available()) {
    // Lê o sinal recebido da porta serial
    char signal = Serial.read();

    if (signal == '1') {
      // Acende o LED na cor verde
      digitalWrite(led, HIGH);    // Acende o LED 
      digitalWrite(lockPin, HIGH);        // Aciona a fechadura

      // Espera por 5 segundos
      delay(5000);

      // Desliga o LED e desativa a fechadura
      digitalWrite(led, LOW);
      digitalWrite(lockPin, LOW);
      
    } else {
      // Desliga o LED e desativa a fechadura
      digitalWrite(led, LOW);
      digitalWrite(lockPin, LOW);
    }
  }
exit(0);
}


