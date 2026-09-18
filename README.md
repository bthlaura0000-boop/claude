# Bucătarul din Frigider 🍳

Aplicație web simplă care îți propune o rețetă pornind de la ingredientele pe care le ai acasă.
Totul în limba română, fără cont și fără cheie API.

## Cum se folosește
1. Deschide **`index.html`** (sau `bucatar.html`, care curăță cache-ul vechi și te duce la aplicație).
2. Alege masa: mic dejun / prânz / cină / desert.
3. Alege numărul de porții și, opțional, bifează **Vegetarian**.
4. Scrie ingredientele pe care le ai.
5. Apasă **Găsește o rețetă** sau **Surprinde-mă** pentru ceva mai creativ.

Rețeta arată timpul de pregătire, ingredientele folosite din ce ai, ce îți mai recomandă și pașii de preparare.

## Note tehnice
- Un singur fișier `index.html`, fără dependențe (doar Google Fonts).
- Sugestiile sunt generate de un serviciu AI gratuit, fără cheie.
- Aplicația **nu** folosește service worker; se încarcă mereu proaspăt de pe rețea.
- Rețetele sunt generate automat — verifică singur timpii de gătire, alergenii și siguranța alimentară.
