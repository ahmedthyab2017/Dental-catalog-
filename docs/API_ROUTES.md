# API Routes

## Auth Routes
- `POST /api/auth/signup` - Register clinic
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

## Clinic Routes
- `GET /api/clinics/profile` - Get clinic profile
- `PUT /api/clinics/profile` - Update clinic profile
- `POST /api/clinics/subscription` - Manage subscription

## Patient Routes
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## Session Routes
- `GET /api/sessions?patient_id=:id` - List sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `GET /api/sessions/:id/timeline` - Get session timeline

## Case Routes
- `GET /api/cases` - List cases
- `POST /api/cases` - Create case
- `PUT /api/cases/:id` - Update case
- `POST /api/cases/:id/publish` - Publish to gallery

## Photo Routes
- `POST /api/photos/upload` - Upload photo
- `DELETE /api/photos/:id` - Delete photo

## Template Routes
- `GET /api/templates` - List templates
- `POST /api/designs/generate` - Generate design

## Payment Routes
- `POST /api/payments/create-session` - Create checkout session
- `POST /api/payments/webhook` - Stripe webhook
