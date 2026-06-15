# Requirements Document

## Introduction

SwafirRE is a decentralised real estate marketplace built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. This document covers the frontend-only Authentication & User Access system. The backend API is assumed to exist and to return a signed JWT (`auth_token` cookie) on successful login or registration.

The system covers: public registration, login, role-based dashboard routing, account/KYC/wallet-status display, profile editing, admin user management, basic activity-log display, and in-app toast notifications. Wallet linking, forgot/reset password, and email verification are explicitly out of scope for this MVP.

---

## Glossary

- **Auth_System**: The SwafirRE frontend authentication and access-control system described by this document.
- **API**: The existing backend REST API consumed by the frontend.
- **JWT**: JSON Web Token returned by the API; stored as the `auth_token` HttpOnly-style cookie and decoded client-side with `jwt-decode`.
- **auth_token**: The name of the cookie that carries the session JWT.
- **Session**: A valid, unexpired JWT stored in the `auth_token` cookie, decoded into `{ sub, role, name, email, exp, iat }`.
- **SUPER_ADMIN**: Highest-privilege role. Cannot be created via public registration. Created only by another SUPER_ADMIN out-of-band (e.g., seeded in the database).
- **ADMIN**: Platform operator role. Can manage users but cannot create SUPER_ADMIN accounts. Created by a SUPER_ADMIN only.
- **PROPERTY_OWNER**: Property-listing role. Can register publicly. Maps to the existing codebase value `owner`.
- **TENANT**: Buyer/renter role. Can register publicly. Maps to the existing codebase value `buyer`.
- **Registrable_Role**: The set `{ PROPERTY_OWNER, TENANT }` — the only roles available in the public registration form.
- **Protected_Page**: Any route under `/dashboard/**`.
- **Dashboard_Redirect**: The role-specific URL a user is sent to immediately after successful login or registration.
- **Account_Status**: One of `PENDING | ACTIVE | SUSPENDED | BLOCKED | REJECTED`. Stored in the user profile returned by the API.
- **KYC_Status**: One of `NOT_STARTED | PENDING | UNDER_REVIEW | APPROVED | REJECTED | EXPIRED`. Display-only for MVP.
- **Wallet_Status**: One of `NOT_LINKED | LINKED | VERIFIED | REVOKED`. Display-only for MVP.
- **Profile_Completion**: A percentage (0–100) calculated from how many optional profile fields have been filled.
- **Proxy**: The Next.js 16 `proxy.ts` file (replaces deprecated `middleware.ts`) that enforces route protection before a request reaches the render layer.
- **Activity_Log**: An ordered list of user-action events (registered, logged in, logged out, failed login, admin suspended, admin blocked) displayed in the dashboard.
- **Toast**: An in-app ephemeral notification rendered via `react-hot-toast`.

---

## Requirements

### Requirement 1: User Registration

**User Story:** As a visitor, I want to create a PROPERTY_OWNER or TENANT account using my email and password, so that I can access role-appropriate features of the platform.

#### Acceptance Criteria

1. THE Auth_System SHALL display a public registration form at `/register` containing fields for full name, email address, password, role selection (limited to Registrable_Role values), and an optional phone number field.
2. WHEN a visitor submits the registration form with valid data, THE Auth_System SHALL call the API registration endpoint and, on a successful response, set the `auth_token` cookie and redirect the user to the role-specific Dashboard_Redirect.
3. WHEN a visitor selects a role in the registration form, THE Auth_System SHALL restrict the available options to `{ PROPERTY_OWNER, TENANT }` — the SUPER_ADMIN and ADMIN roles SHALL NOT appear as selectable options.
4. WHEN the API returns a success response for registration, THE Auth_System SHALL display a "Registration successful" Toast notification.
5. IF the API returns an error response for registration, THEN THE Auth_System SHALL display a generic error message ("Registration failed. Please try again.") without revealing field-specific error details from the server.
6. WHILE the registration API call is in-flight, THE Auth_System SHALL disable the submit button and display a loading indicator to prevent duplicate submissions.
7. WHEN a visitor submits the registration form, THE Auth_System SHALL validate that the full name is non-empty, the email matches a valid email format, the password meets the minimum-length requirement (≥ 8 characters), and the selected role is a Registrable_Role — and SHALL display inline validation errors for any failing field before the API call is made.

---

### Requirement 2: User Login

**User Story:** As a registered user, I want to sign in with my email and password, so that I can access my dashboard and protected features.

#### Acceptance Criteria

1. THE Auth_System SHALL display a public login form at `/login` containing fields for email address and password.
2. WHEN a user submits the login form with valid credentials, THE Auth_System SHALL call the API login endpoint and, on success, store the returned JWT as the `auth_token` cookie and redirect the user to the Dashboard_Redirect for their role.
3. WHEN the login form is submitted and the URL contains a `from` query parameter, THE Auth_System SHALL redirect the user to the path specified by `from` after successful authentication, instead of the default Dashboard_Redirect.
4. IF the API returns an error response for login (including wrong credentials, BLOCKED status, or SUSPENDED status), THEN THE Auth_System SHALL display exactly the message "Invalid email or password." and SHALL NOT reveal whether the email exists, whether the password was wrong, or the specific account status.
5. WHILE the login API call is in-flight, THE Auth_System SHALL disable the submit button and display a loading indicator.
6. WHEN a user submits the login form, THE Auth_System SHALL validate that the email field is non-empty and matches a valid email format and that the password field is non-empty — displaying inline validation errors for failing fields before any API call is made.

---

### Requirement 3: Role-Based Dashboard Routing

**User Story:** As an authenticated user, I want to be redirected to the correct dashboard for my role after login, so that I immediately see content relevant to my responsibilities.

#### Acceptance Criteria

1. WHEN a SUPER_ADMIN authenticates successfully, THE Auth_System SHALL redirect them to `/dashboard/super-admin`.
2. WHEN an ADMIN authenticates successfully, THE Auth_System SHALL redirect them to `/dashboard/users`.
3. WHEN a PROPERTY_OWNER authenticates successfully, THE Auth_System SHALL redirect them to `/dashboard/listings`.
4. WHEN a TENANT authenticates successfully, THE Auth_System SHALL redirect them to `/dashboard/favorites`.
5. THE Auth_System SHALL define a deterministic mapping from every valid role to exactly one Dashboard_Redirect — no role SHALL map to more than one dashboard path and no role SHALL be left without a mapping.

---

### Requirement 4: Route Protection

**User Story:** As a platform operator, I want unauthenticated and unauthorised users to be blocked from Protected_Pages, so that user data and admin features remain secure.

#### Acceptance Criteria

1. WHEN a request arrives at a Protected_Page with no `auth_token` cookie, THE Proxy SHALL redirect the request to `/login?from=<original-path>` — IF the redirect itself cannot be issued (e.g. due to a Proxy error), THEN THE Proxy SHALL block the request with a 500 response rather than forward it to the Protected_Page.
2. WHEN a request arrives at a Protected_Page with an expired or invalid `auth_token` cookie, THE Proxy SHALL delete the `auth_token` cookie and redirect the request to `/login?from=<original-path>`.
3. WHEN a request arrives at a Protected_Page with a valid Session whose role is not permitted for that path, THE Proxy SHALL redirect the request to `/unauthorized`.
4. WHEN a request arrives at a Protected_Page with a valid Session whose role is permitted, THE Proxy SHALL attach `x-user-id`, `x-user-role`, and `x-user-name` headers to the forwarded request so that Server Components can read the decoded identity without re-parsing the JWT.
5. THE Auth_System SHALL ensure that SUPER_ADMIN-only routes (e.g. `/dashboard/super-admin`) are inaccessible to all other roles via the Proxy role-to-route mapping.

---

### Requirement 5: Logout

**User Story:** As an authenticated user, I want to sign out of my account, so that my session is terminated and another person cannot access my data from this device.

#### Acceptance Criteria

1. WHEN a user triggers the logout action, THE Auth_System SHALL call the API logout endpoint (best-effort) and then unconditionally clear the `auth_token` cookie — IF the cookie clearing operation itself fails, THE Auth_System SHALL force a complete session reset by invalidating all React Query cache entries and redirecting to `/`.
2. WHEN the `auth_token` cookie has been cleared, THE Auth_System SHALL clear all React Query cached data and redirect the user to the public home page (`/`).
3. IF the API logout endpoint returns an error, THEN THE Auth_System SHALL still clear the `auth_token` cookie and redirect the user to `/`.

---

### Requirement 6: Account Status Enforcement

**User Story:** As a platform operator, I want BLOCKED and SUSPENDED users to be prevented from accessing protected features, so that policy violations are enforced at the access layer.

#### Acceptance Criteria

1. WHEN a BLOCKED user attempts to log in, THE Auth_System SHALL deny the login and display the generic error message "Invalid email or password." — the user's BLOCKED status SHALL NOT be revealed.
2. WHEN a SUSPENDED user has an active Session and navigates to a Protected_Page, THE Auth_System SHALL prevent access and display an appropriate access-denied message.
3. THE Auth_System SHALL display the Account_Status value on the user's profile page at `/dashboard/settings` for informational purposes.
4. THE Auth_System SHALL display the KYC_Status value on the user's profile page at `/dashboard/settings` for informational purposes (display-only, no editing for MVP).
5. THE Auth_System SHALL display the Wallet_Status value on the user's profile page at `/dashboard/settings` for informational purposes (display-only, no editing for MVP).

---

### Requirement 7: Profile Display and Editing

**User Story:** As an authenticated user, I want to view and partially update my profile information at `/dashboard/settings`, so that my account details stay current.

#### Acceptance Criteria

1. THE Auth_System SHALL display the following read-only fields on the settings page: email address, role, Account_Status, KYC_Status, Wallet_Status, and Profile_Completion percentage.
2. THE Auth_System SHALL display the following editable fields on the settings page: full name, phone number, and profile image.
3. THE Auth_System SHALL provide a change-password section on the settings page that accepts a current password, new password, and confirm new password.
4. WHEN a user submits the profile edit form with valid data, THE Auth_System SHALL call the API profile-update endpoint and display a "Profile updated." Toast on success.
5. IF the API returns an error for a profile update, THEN THE Auth_System SHALL display a generic error message without exposing field-specific server error details.
6. THE Auth_System SHALL NOT allow a user to modify their own role via any form on the settings page — the role field SHALL be read-only.
7. WHEN a user submits the change-password form, THE Auth_System SHALL validate that the new password meets the minimum-length requirement (≥ 8 characters) and that the confirm password matches — displaying inline validation errors before any API call is made.
8. WHEN a password change is successful, THE Auth_System SHALL display a "Password changed." Toast notification.

---

### Requirement 8: Admin User Management

**User Story:** As an ADMIN, I want to list, search, and manage user accounts at `/dashboard/users`, so that I can maintain platform integrity and handle policy violations.

#### Acceptance Criteria

1. THE Auth_System SHALL display a paginated list of all registered users at `/dashboard/users`, showing at minimum: full name, email, role, and Account_Status per user.
2. WHEN an ADMIN enters text in the search field, THE Auth_System SHALL filter the displayed user list to rows where the full name or email contains the search text (case-insensitive).
3. WHEN an ADMIN selects a role filter, THE Auth_System SHALL filter the displayed user list to users whose role matches the selected value.
4. WHEN an ADMIN selects a status filter, THE Auth_System SHALL filter the displayed user list to users whose Account_Status matches the selected value.
5. WHEN an ADMIN triggers the suspend action for a user, THE Auth_System SHALL call the API suspend endpoint and, on success, update that user's displayed Account_Status to SUSPENDED.
6. WHEN an ADMIN triggers the reactivate action for a user, THE Auth_System SHALL call the API reactivate endpoint and, on success, update that user's displayed Account_Status to ACTIVE.
7. WHEN an ADMIN triggers the change-role action for a user, THE Auth_System SHALL call the API role-update endpoint and, on success, update that user's displayed role — and the ADMIN SHALL NOT be able to assign the SUPER_ADMIN role via this interface.
8. IF any admin user-management API call fails, THEN THE Auth_System SHALL display a generic error Toast without revealing internal server details.
9. THE Auth_System SHALL require confirmation (a confirmation dialog) before executing any destructive or status-changing action (suspend, reactivate, change role).

---

### Requirement 9: Activity Log Display

**User Story:** As an authenticated user, I want to see a basic log of account-related events, so that I can monitor activity on my account.

#### Acceptance Criteria

1. THE Auth_System SHALL track and display the following event types in the Activity_Log: user registered, user logged in, user logged out, failed login attempt, admin suspended user, admin blocked user.
2. WHEN the Activity_Log is displayed, THE Auth_System SHALL show events in reverse-chronological order (newest first).
3. THE Auth_System SHALL display each Activity_Log entry with at minimum: event type label and a human-readable timestamp.
4. WHEN there are no Activity_Log entries to display, THE Auth_System SHALL show an appropriate empty-state message within the Activity_Log interface — the Activity_Log interface SHALL remain visible and functional regardless of whether the empty-state message renders correctly.

---

### Requirement 10: In-App Toast Notifications

**User Story:** As a user, I want brief, non-intrusive notifications after key actions, so that I receive immediate feedback without being interrupted.

#### Acceptance Criteria

1. WHEN registration completes successfully, THE Auth_System SHALL display a success Toast with the message "Account created! Welcome to SwafirRE."
2. WHEN login completes successfully, THE Auth_System SHALL display a success Toast with the message "Welcome back, {name}!" where `{name}` is the user's display name from the JWT.
3. WHEN a password change completes successfully, THE Auth_System SHALL display a success Toast with the message "Password changed."
4. WHEN a user's account is suspended (as reported by an API response or push notification), THE Auth_System SHALL display a warning Toast with the message "Your account has been suspended."
5. WHEN a suspended account is reactivated, THE Auth_System SHALL display a success Toast with the message "Your account has been reactivated."
6. THE Auth_System SHALL use `react-hot-toast` as the sole Toast library — no other notification mechanism SHALL be introduced for these events.

---

### Requirement 11: Security and Cookie Hygiene

**User Story:** As a security-conscious platform operator, I want all auth-related cookie and error handling to follow best practices, so that user credentials and session data are not inadvertently exposed.

#### Acceptance Criteria

1. WHEN the Auth_System sets the `auth_token` cookie after login or registration, THE Auth_System SHALL set `path=/`, `SameSite=Lax`, and a `max-age` of 7 days (604 800 seconds).
2. WHEN a user logs out, THE Auth_System SHALL clear the `auth_token` cookie by setting `max-age=0`.
3. THE Auth_System SHALL NEVER expose field-specific validation errors returned by the API in any visible UI element — all server-side auth errors SHALL be surfaced as one of the generic messages defined in Requirements 2.4 and 5.5.
4. WHEN the Proxy detects an expired or invalid `auth_token`, THE Proxy SHALL delete the `auth_token` cookie on the redirect response so stale tokens do not persist in the browser.
