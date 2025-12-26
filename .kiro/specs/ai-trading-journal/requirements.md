# Requirements Document

## Introduction

The AI Trading Journal is a comprehensive trading analysis and journaling platform that enables traders to record, analyze, and improve their trading performance through AI-powered insights. The system captures trade data, user emotions, and contextual notes, then leverages artificial intelligence to provide sentiment analysis, performance insights, pattern recognition, and personalized recommendations.

## Glossary

- **Trading Journal System**: The complete application including frontend, backend, database, and AI integration components
- **Trade Entry**: A single recorded trading transaction with associated metadata (entry/exit prices, timestamps, instrument, P&L)
- **Journal Note**: User-provided textual or audio commentary about trades, market conditions, or emotional state
- **Emotion Analysis Module**: AI-powered component that processes user input to determine emotional state and sentiment
- **Trade Insights Engine**: AI component that analyzes trading patterns and generates actionable recommendations
- **Chat Assistant**: Conversational AI interface that answers questions about trading history and performance
- **Voice Transcription Service**: Component that converts audio recordings to text using speech-to-text AI
- **User**: A trader who uses the Trading Journal System to record and analyze their trades
- **Sentiment Score**: Numerical representation of emotional state ranging from negative to positive
- **Risk-Reward Ratio**: The ratio of potential profit to potential loss in a trade
- **Volatility**: Measure of price fluctuation in a trading instrument
- **P&L**: Profit and Loss from a trade
- **Trade Direction**: Whether the trade is a buy/long or sell/short position
- **Trade Type**: The category of trading (crypto, stock, funded account, etc.)
- **Leverage**: Multiplier applied to the original capital for the trade
- **Base Currency**: The currency in which the trade P&L is calculated (INR or USD)
- **Emotional State**: The trader's psychological condition at the time of entering the trade
- **Impulsive Trade**: A trade taken hastily without proper analysis

## Requirements

### Requirement 1

**User Story:** As a trader, I want to record my trades with comprehensive details including timing, trade type, direction, prices, leverage, and currency, so that I can maintain an accurate and detailed history of my trading activity

#### Acceptance Criteria

1. WHEN the User submits a trade entry form, THE Trading Journal System SHALL store the trade with date, time, trade type, instrument name, trade direction, average buy price, average sell price, position size, leverage, original capital, base currency, and P&L
2. THE Trading Journal System SHALL support trade types including crypto, stock, futures, options, and funded account
3. THE Trading Journal System SHALL support trade directions including buy/long and sell/short with option type selection for options trades
4. THE Trading Journal System SHALL allow the User to specify leverage as a decimal value between 1 and 100
5. THE Trading Journal System SHALL support base currency selection between INR and USD with INR as the default
6. THE Trading Journal System SHALL calculate P&L automatically based on trade direction, average buy price, average sell price, position size, leverage, and base currency
7. WHEN the User requests their trade history, THE Trading Journal System SHALL retrieve and display all trades sorted by timestamp in descending order
8. IF the User submits a trade entry with missing required fields (date, time, trade type, instrument, trade direction, prices, emotional state), THEN THE Trading Journal System SHALL reject the submission and display specific validation errors
9. WHEN the User edits an existing trade entry, THE Trading Journal System SHALL update the record and recalculate dependent metrics
10. THE Trading Journal System SHALL maintain separate P&L calculations for trades in different base currencies

### Requirement 2

**User Story:** As a trader, I want to record my emotional state and indicate whether a trade was impulsive at the time of entry, so that I can understand my psychological patterns and their impact on trading performance

#### Acceptance Criteria

1. WHEN the User creates a trade entry, THE Trading Journal System SHALL require the User to select an emotional state from predefined options including confident, fearful, greedy, anxious, neutral, excited, and frustrated
2. WHEN the User creates a trade entry, THE Trading Journal System SHALL provide an option to indicate whether the trade was taken impulsively
3. THE Trading Journal System SHALL store the emotional state and impulsive indicator as required fields with each trade entry
4. WHEN the User views a trade entry, THE Trading Journal System SHALL display the emotional state and impulsive indicator prominently
5. THE Trading Journal System SHALL allow filtering and grouping of trades by emotional state and impulsive indicator

### Requirement 3

**User Story:** As a trader, I want to add optional notes and screenshots to my trades, so that I can capture additional context and chart setups

#### Acceptance Criteria

1. WHEN the User submits a text note for a trade, THE Trading Journal System SHALL store the note and associate it with the specified trade entry
2. THE Trading Journal System SHALL support notes with a maximum length of 5000 characters
3. WHEN the User uploads a screenshot image, THE Trading Journal System SHALL store the image and associate it with the specified trade entry
4. THE Trading Journal System SHALL support image formats including PNG, JPG, and JPEG with a maximum file size of 5 MB
5. WHEN the User views a trade entry, THE Trading Journal System SHALL display all associated notes and screenshots

### Requirement 4

**User Story:** As a trader, I want to view my trades across different pages and filters, so that I can analyze my performance from multiple perspectives

#### Acceptance Criteria

1. THE Trading Journal System SHALL provide a trades list page displaying all trades with key metrics in a table format
2. WHEN the User applies filters by date range, trade type, currency, or emotional state, THE Trading Journal System SHALL update the displayed trades within 2 seconds
3. THE Trading Journal System SHALL provide a detailed trade view page showing all information for a single trade including screenshots and notes
4. WHEN the User navigates between pages, THE Trading Journal System SHALL maintain filter and sort preferences
5. THE Trading Journal System SHALL display separate P&L summaries for INR and USD trades on all pages

### Requirement 5 (AI Integration - Phase 2)

**User Story:** As a trader, I want AI to analyze my emotional state from my notes, so that I can identify patterns between emotions and trading performance

#### Acceptance Criteria

1. WHEN the User submits a journal note, THE Emotion Analysis Module SHALL analyze the text and generate a sentiment score within 5 seconds
2. THE Emotion Analysis Module SHALL classify emotions into categories including fear, greed, confidence, anxiety, and neutral
3. WHEN emotion analysis completes, THE Trading Journal System SHALL store the sentiment score and emotion classification with the journal note
4. WHEN the User requests emotion trends, THE Trading Journal System SHALL display sentiment scores over time with visual representation
5. THE Trading Journal System SHALL correlate emotion data with trade outcomes and display the relationship

### Requirement 6 (AI Integration - Phase 2)

**User Story:** As a trader, I want AI-powered insights about my trading patterns, so that I can identify weaknesses and improve my strategy

#### Acceptance Criteria

1. WHEN the User has recorded at least 20 trades, THE Trade Insights Engine SHALL analyze trading patterns and generate insights
2. THE Trade Insights Engine SHALL identify correlations between trading frequency and market volatility
3. WHEN the Trade Insights Engine detects overtrading patterns, THE Trading Journal System SHALL display a warning with specific metrics
4. THE Trade Insights Engine SHALL compare the User's risk-reward ratios against optimal benchmarks and provide recommendations
5. WHEN the User requests performance analysis, THE Trading Journal System SHALL display AI-generated insights within 10 seconds

### Requirement 7 (AI Integration - Phase 2)

**User Story:** As a trader, I want to ask questions about my trading history using natural language, so that I can quickly extract insights without manual analysis

#### Acceptance Criteria

1. WHEN the User submits a natural language question, THE Chat Assistant SHALL process the query and access relevant trade data
2. THE Chat Assistant SHALL respond to questions about trading statistics, patterns, and historical performance within 8 seconds
3. WHEN the Chat Assistant cannot answer a question due to insufficient data, THE Trading Journal System SHALL inform the User with specific data requirements
4. THE Chat Assistant SHALL support questions about time-based analysis including daily, weekly, and monthly performance
5. THE Chat Assistant SHALL provide responses with specific numerical data and references to relevant trades

### Requirement 8 (AI Integration - Phase 2)

**User Story:** As a trader, I want to record voice notes that are automatically transcribed, so that I can quickly capture thoughts without typing

#### Acceptance Criteria

1. WHEN the User submits an audio recording, THE Voice Transcription Service SHALL convert the audio to text within 10 seconds
2. WHEN the Voice Transcription Service completes transcription, THE Trading Journal System SHALL store the transcribed text as a journal note
3. THE Voice Transcription Service SHALL support audio formats including MP3, WAV, and M4A with a maximum file size of 10 MB
4. IF transcription fails, THEN THE Trading Journal System SHALL store the audio file and allow manual note entry
5. THE Trading Journal System SHALL display both the original audio and transcribed text when available

### Requirement 9

**User Story:** As a trader, I want to view comprehensive dashboards of my performance, so that I can monitor my progress at a glance

#### Acceptance Criteria

1. THE Trading Journal System SHALL display total P&L (separated by INR and USD), win rate, total trades, and average profit per trade on the main dashboard
2. WHEN the User accesses the dashboard, THE Trading Journal System SHALL load and display all metrics within 3 seconds
3. THE Trading Journal System SHALL provide visual charts for P&L over time, trade distribution by type, and emotional state distribution
4. WHEN the User filters dashboard data by date range, THE Trading Journal System SHALL update all metrics and charts accordingly
5. THE Trading Journal System SHALL display performance metrics grouped by trade type (crypto, stock, funded account, etc.)

### Requirement 10

**User Story:** As a trader, I want secure authentication and data privacy, so that my trading information remains confidential

#### Acceptance Criteria

1. WHEN the User creates an account, THE Trading Journal System SHALL require email and password with minimum security requirements
2. THE Trading Journal System SHALL hash all passwords using industry-standard algorithms before storage
3. WHEN the User logs in, THE Trading Journal System SHALL require valid credentials and issue a secure session token
4. THE Trading Journal System SHALL automatically expire user sessions after 24 hours of inactivity
5. THE Trading Journal System SHALL ensure that users can only access their own trade data and journal entries

### Requirement 11 (AI Integration - Phase 2)

**User Story:** As a trader, I want the system to handle AI service failures gracefully, so that I can continue journaling even when AI features are unavailable

#### Acceptance Criteria

1. IF an AI service request fails, THEN THE Trading Journal System SHALL retry the request up to 3 times with exponential backoff
2. IF all retry attempts fail, THEN THE Trading Journal System SHALL store the request for later processing and notify the User
3. WHEN AI services are unavailable, THE Trading Journal System SHALL allow users to record trades and notes without AI analysis
4. THE Trading Journal System SHALL process queued AI requests automatically when services become available
5. WHEN an AI service error occurs, THE Trading Journal System SHALL log the error details for debugging without exposing them to the User
