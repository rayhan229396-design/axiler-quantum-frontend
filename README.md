# Axiler Quantum — Frontend Prototype

This is a frontend-only recreation based on the supplied video reference.

Included:
- Home / Trade screen
- Photo Analysis flow
- Image upload preview and remove/change
- Manual Analysis → OTC asset picker → timeframe picker
- Signal result screen with animated countdown
- Today's Best Setups cards
- Reviews tab
- Profile tab
- Back buttons and bottom navigation
- Responsive mobile-first styling

Intentionally NOT included:
- Real market-data connection
- Signal/AI engine
- Broker API
- Authentication/backend
- Trade execution

## Run

```bash
npm install
npm run dev
```

The signal values are demo/static UI data. Replace `makeSignal()` and the photo-analysis result with your real engine later.
