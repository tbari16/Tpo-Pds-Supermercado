# E-Commerce Platform Frontend Design Prompt for Figma

## PROJECT OVERVIEW
Design a complete, modern, and user-friendly frontend for a full-stack e-commerce platform. The platform serves two main user roles (Client and Admin) with distinct workflows, payment processing, order tracking, and notification systems.

---

## DESIGN REQUIREMENTS

### 1. DESIGN SYSTEM & FOUNDATIONS
- **Color Palette**: 
  - Primary: Modern blue/teal (for CTAs and key elements)
  - Secondary: Complementary accent color
  - Neutral: Clean grays for backgrounds and text
  - Status colors: Green (success), Red (error), Orange (warning), Blue (info)
  - Background: Light/white with subtle patterns optional

- **Typography**:
  - Heading font: Modern sans-serif (e.g., Inter, Poppins)
  - Body font: Clean, readable sans-serif (e.g., Inter, Roboto)
  - Font sizes: Establish clear hierarchy (H1, H2, H3, body, small)
  - Line heights: 1.5+ for body text for readability

- **Spacing & Grid**: 
  - 8px baseline grid system
  - Consistent padding/margins throughout
  - Responsive breakpoints: Mobile (320px), Tablet (768px), Desktop (1024px+)

- **Components Library**: 
  - Create reusable components: buttons, inputs, cards, modals, badges, notifications
  - Include hover/active/disabled states
  - Ensure accessibility (contrast ratios, focus states)

---

### 2. CLIENT-SIDE SCREENS

#### 2.1 AUTHENTICATION FLOWS

**Login Screen**
- Email and password input fields with validation indicators
- "Remember me" checkbox (optional)
- "Forgot password?" link
- Submit button ("Sign In")
- Link to registration page
- Brand logo/header
- Optional: Social login buttons (future feature indicator)

**Registration Screen**
- Fields: First Name, Last Name, Email, Password, Confirm Password
- Password strength indicator (show min. 6 characters requirement)
- Terms & Conditions checkbox with link
- Submit button ("Create Account")
- Link back to login
- Success confirmation message design

**Password Recovery Screen**
- Email input field
- "Send Reset Link" button
- Confirmation message after submission

---

#### 2.2 CLIENT DASHBOARD / HOME

**Navigation Bar**
- Logo/brand name
- Menu items: Products, My Orders, Notifications, Account
- Shopping cart icon with badge showing item count
- Logout button
- Search bar (prominent, for product search)
- Mobile hamburger menu for tablet/mobile

**Hero/Landing Section**
- Welcome message personalized with client name
- Featured products carousel or banner
- Category quick access buttons

---

#### 2.3 PRODUCT CATALOG

**Product Listing Page**
- **Left Sidebar (Filters)**:
  - Category tree view (hierarchical, expandable categories)
  - Search input field (real-time search)
  - Price range slider
  - Product status filter (active/inactive)
  - Clear filters button

- **Main Content Area**:
  - Grid layout (3-4 columns on desktop, responsive)
  - Product cards showing:
    - Product image
    - Product name
    - Category name (small text/badge)
    - Price (prominent, bold)
    - Stock status (In Stock / Out of Stock with visual indicator)
    - Unit (kg, liters, units, etc.)
    - Quick "Add to Cart" button
    - Hover effect: Show add-to-cart button, slightly enlarge card
  - Pagination controls at bottom (page numbers, next/previous)
  - "Items per page" selector (10, 25, 50)
  - Total products count

**Product Detail Page**
- Product image (large, with zoom/gallery support for future)
- Product name and category breadcrumb
- Price (large, prominent)
- Stock availability with quantity indicator (e.g., "12 in stock")
- Unit of measurement displayed clearly
- Full product description (formatted text)
- Weight information (if available)
- Date added (optional, small text)
- **Add to Cart Section**:
  - Quantity input (spinner/stepper or text input)
  - "Add to Cart" button (large, primary color)
  - Related/suggested products section below

---

#### 2.4 SHOPPING CART

**Cart Page**
- **Cart Items List**:
  - Table or card-based layout showing:
    - Product image (small)
    - Product name
    - Unit price
    - Quantity (with +/- buttons or input field)
    - Subtotal per item
    - Remove button (trash icon or "Remove" text)
  - Hover state: Highlight row, show remove button clearly

- **Cart Summary Section** (sticky or below items):
  - Subtotal
  - Taxes (if applicable)
  - Shipping cost (if applicable)
  - **Total** (large, bold, primary color)
  - "Continue Shopping" button (secondary)
  - "Proceed to Checkout" button (primary, large)
  - "Clear Cart" button (warning style)

- **Empty Cart State**:
  - Friendly message
  - Illustration (simple, modern)
  - "Continue Shopping" button

---

#### 2.5 CHECKOUT FLOW

**Checkout - Step 1: Shipping Address**
- Form fields:
  - Street address (required)
  - City (required)
  - State/Province (required)
  - Postal code (required)
  - Country selector (required)
  - Additional notes (optional textarea)
- Address validation message (if applicable)
- "Continue to Payment" button
- "Back to Cart" link
- Progress indicator (Step 1 of 2 or similar)

**Checkout - Step 2: Payment Method & Review**
- **Payment Method Selection**:
  - Radio buttons or card-based selector for:
    - Bank Transfer (TRANSFERENCIA)
    - Credit/Debit Card (TARJETA)
    - Cash (EFECTIVO)
    - Additional methods as needed
  - Each option with icon and description
  - Show additional fields based on selected method (e.g., reference field for bank transfer)

- **Order Review**:
  - Summary of items (compact):
    - Product name
    - Quantity
    - Unit price
    - Subtotal
  - Shipping address summary
  - Payment method selected
  - **Final Total** (very prominent)

- **Action Buttons**:
  - "Edit Cart" button (link, secondary)
  - "Edit Address" button (link, secondary)
  - "Place Order" button (large, primary, prominent)

- **Progress Indicator**: Show Step 2 of 2

**Order Confirmation Page**
- Success message with checkmark icon
- Order number prominently displayed
- Order summary (items, total, delivery address)
- Estimated delivery date (if applicable)
- "View Order Details" button
- "Continue Shopping" button
- Optional: Download invoice link

---

#### 2.6 MY ORDERS

**Orders List Page**
- **Order Cards/Table** showing:
  - Order number
  - Date placed
  - Total amount
  - Current status (with color-coded badge):
    - PENDIENTE (Orange/Yellow)
    - CONFIRMADO (Blue)
    - ENVIADO (Light Blue)
    - ENTREGADO (Green)
    - CANCELADO (Red/Gray)
  - Number of items
  - View Details button
  - Hover effect: Highlight card, show action button clearly

- **Filters/Sorting**:
  - Filter by status (checkboxes or dropdown)
  - Sort by date (newest/oldest)
  - Search by order number

- **Empty State** (if no orders):
  - Friendly message with illustration
  - "Start Shopping" button

**Order Detail Page**
- **Order Header**:
  - Order number
  - Date placed
  - Current status (large badge)
  - Timeline showing order progression:
    - PENDIENTE → CONFIRMADO → ENVIADO → ENTREGADO
    - Show completed steps with checkmarks
    - Highlight current step

- **Order Items Section**:
  - Item list (name, quantity, unit price, subtotal)
  - Total amount

- **Shipping Information**:
  - Delivery address
  - Estimated delivery date (if shipped)
  - Tracking information (if available/future feature)

- **Payment Information**:
  - Payment method used
  - Reference number (if applicable)
  - Payment status

- **Action Buttons** (context-dependent):
  - "Reorder" button (secondary)
  - "Cancel Order" button (warning, if status is PENDIENTE or CONFIRMADO)
  - "Contact Support" button (secondary)
  - Back button

---

#### 2.7 NOTIFICATIONS

**Notification Bell Icon**
- Located in top navigation
- Badge with unread count (red dot or number)

**Notification Panel/Dropdown**
- Last 5-10 notifications in dropdown or modal
- Each notification showing:
  - Icon (order icon, status icon, etc.)
  - Message text
  - Timestamp (relative: "2 hours ago")
  - Read/unread indicator
  - Mark as read button or click to dismiss

**Notification Types**:
- Order status changed
- Order confirmed
- Order shipped
- Order delivered
- Stock alerts
- Promotion alerts

**Desktop Notification (Browser)**:
- Show system notifications for real-time updates
- Use toast/snackbar for in-app notifications

---

#### 2.8 USER ACCOUNT / PROFILE

**Account Settings Page**
- **Personal Information Section**:
  - First Name (editable)
  - Last Name (editable)
  - Email (display, with change option)
  - Edit button
  - Save/Cancel buttons on edit mode

- **Saved Addresses** (future feature):
  - List of saved addresses
  - Add new address button
  - Edit/Delete buttons per address

- **Password Change**:
  - Current password input
  - New password input
  - Confirm password input
  - Change password button

- **Account Preferences**:
  - Email notifications toggle
  - SMS notifications toggle (if applicable)
  - Language preference dropdown

- **Logout Section**:
  - "Logout from all devices" option (future)
  - "Logout" button (warning color)

---

### 3. ADMIN-SIDE SCREENS

#### 3.1 ADMIN DASHBOARD

**Admin Navigation**
- Logo and Admin indicator
- Menu items: Dashboard, Products, Categories, Orders, Users (optional)
- Admin profile dropdown
- Logout button

**Dashboard Overview**
- Quick stats cards:
  - Total Orders (this month/week)
  - Total Revenue
  - Pending Orders
  - New Customers (optional)
- Charts (placeholders for future data integration):
  - Sales trend line chart
  - Orders by status pie/bar chart
  - Top products
- Recent orders table (last 5-10)

---

#### 3.2 PRODUCT MANAGEMENT

**Products List Page**
- **Table/Grid Layout** showing:
  - Product image (thumbnail)
  - Product name
  - Category
  - Price
  - Stock quantity
  - Active/Inactive status (toggle or badge)
  - Actions: Edit, Delete (with confirmation)
  - Checkbox for bulk actions (future feature)

- **Filters & Search**:
  - Search by product name
  - Filter by category
  - Filter by active/inactive
  - Clear filters button

- **Sorting**: 
  - By name, price, stock, date added
  - Ascending/descending

- **Pagination**:
  - Page numbers
  - Items per page selector

- **Create Product Button** (prominent, primary color, top-right)

**Create/Edit Product Form**
- Modal or full page form with sections:
  - **Basic Information**:
    - Product name (required, text input)
    - Description (required, textarea or rich text editor)
    - Category (required, dropdown/select with hierarchical options)

  - **Pricing & Stock**:
    - Price (required, number input)
    - Stock quantity (required, number input)
    - Unit of measurement (required, dropdown: KG, LITRO, UNIDAD, etc.)
    - Weight (optional, number input)

  - **Image Upload**:
    - Drag-and-drop zone or file picker
    - Preview of uploaded image
    - Remove image button
    - File size limit indicator

  - **Status**:
    - Active/Inactive toggle switch

  - **Form Actions**:
    - "Save Product" button (primary)
    - "Cancel" button (secondary)
    - "Delete Product" button (warning, edit mode only)

- **Validation Messages**:
  - Show inline error messages (red text below field)
  - Highlight invalid fields with red border

**Delete Confirmation Modal**
- Warning message
- Product name shown
- "Cancel" and "Delete" buttons (with warning styling)

---

#### 3.3 CATEGORY MANAGEMENT

**Categories List Page**
- **Tree/Hierarchical View**:
  - Show parent-child relationships visually
  - Expandable/collapsible categories
  - Indentation to show hierarchy levels
  - Drag-and-drop to reorder (future feature)

- **Category Cards/Rows** showing:
  - Category name
  - Number of products
  - Parent category (if applicable)
  - Actions: Edit, Delete, Add Subcategory
  - Expand/collapse icon

- **Create Category Button** (top-right, primary)

**Create/Edit Category Form**
- Modal with fields:
  - Category name (required, text input)
  - Parent category (optional, dropdown - for subcategories)
  - Description (optional, textarea)
  - Active/Inactive toggle
  - Form actions: Save, Cancel
  - Delete button (edit mode only)

**Delete Confirmation Modal**
- Warning if category has products
- Option to reassign products to another category
- "Cancel" and "Delete" buttons

---

#### 3.4 ORDER MANAGEMENT

**Orders List Page**
- **Table Layout** showing:
  - Order number (link to detail)
  - Client name
  - Date placed
  - Status (color-coded badge):
    - PENDIENTE (Orange)
    - CONFIRMADO (Blue)
    - ENVIADO (Light Blue)
    - ENTREGADO (Green)
    - CANCELADO (Red/Gray)
  - Total amount
  - Payment method
  - Actions: View, Edit Status

- **Filters & Search**:
  - Search by order number or client name
  - Filter by status (multi-select checkboxes)
  - Filter by payment method
  - Date range picker
  - Clear filters button

- **Sorting**:
  - By order number, date, total, status
  - Ascending/descending

- **Pagination**: Standard pagination controls

- **Bulk Actions** (future):
  - Select multiple orders
  - Change status for multiple orders

**Order Detail Page (Admin)**
- **Order Header**:
  - Order number
  - Client name with link (optional)
  - Date placed
  - Current status (large badge with change button)

- **Status Timeline**:
  - Visual progression of order states
  - Show timestamps for each completed step

- **Order Items**:
  - Table with: Product name, quantity, unit price, subtotal
  - Order total

- **Client Information**:
  - Name
  - Email (with contact option)
  - Phone (if available)

- **Shipping Information**:
  - Delivery address
  - Shipping method (optional field)

- **Payment Information**:
  - Method
  - Reference number
  - Payment status

- **Admin Actions**:
  - Status selector dropdown with "Update Status" button
  - Change status modal confirmation
  - "Send Notification" button (to client)
  - Print order button
  - Back to orders list link

**Status Change Confirmation Modal**
- Show current and new status
- "Confirm" and "Cancel" buttons
- Success message after confirmation

---

### 4. SHARED COMPONENTS

**Header/Navigation Bar**
- Logo (clickable, goes to home)
- Main navigation items (responsive, hamburger menu on mobile)
- Search bar (with search icon)
- Icons: Cart (with badge), Notifications (with badge), User profile
- Mobile: Hamburger menu, search icon, cart icon, profile

**Footer** (Client-side)
- Links: About, Contact, Terms, Privacy, FAQ
- Newsletter signup (optional)
- Social media links (optional)
- Copyright information

**Sidebar Navigation** (Admin-side)
- Collapsible menu
- Icons and labels for each section
- Active state highlighting
- Collapse/expand button

**Buttons**
- Primary (solid, main color)
- Secondary (outline or lighter)
- Danger/Warning (red for delete actions)
- Disabled state (gray, opacity reduced)
- Hover states (darker shade or shadow)
- Loading state (spinner/loader)
- Sizes: Small, Medium (default), Large

**Form Elements**
- Text inputs (regular, email, password, number)
- Textareas
- Selects/Dropdowns
- Radio buttons
- Checkboxes
- Toggles/Switches
- Date pickers
- File upload inputs
- All with: labels, placeholder text, error states, help text (optional)

**Cards**
- Product cards (image, name, price, action)
- Order cards (order info, status, action)
- Stats cards (metric, value, trend indicator)
- Consistent shadow/border styling

**Badges/Tags**
- Status badges (different colors per status)
- Category tags
- Stock status indicators (In Stock, Low Stock, Out of Stock)

**Modals/Dialogs**
- Header with title
- Close button
- Content area
- Footer with action buttons
- Overlay background
- Responsive sizing

**Notifications/Toasts**
- Success toast (green, checkmark icon)
- Error toast (red, X icon)
- Warning toast (orange, warning icon)
- Info toast (blue, info icon)
- Auto-dismiss after 4-5 seconds
- Close button
- Stack multiple notifications

**Loading States**
- Skeleton screens for list pages
- Spinner for button actions
- Loading message for modals

**Empty States**
- Illustrations (simple, modern)
- Friendly messages
- Call-to-action buttons

**Error Pages**
- 404 Not Found
- 500 Server Error
- Illustrations and helpful messages
- Links back to home/previous page

---

### 5. RESPONSIVE DESIGN

**Mobile (320px - 767px)**
- Single column layouts
- Full-width buttons
- Stacked forms
- Collapsible navigation (hamburger menu)
- Simplified tables (card layout instead)
- Touch-friendly sizes (44px minimum tap target)
- Larger spacing/padding

**Tablet (768px - 1023px)**
- 2-column layouts where appropriate
- Horizontal navigation possible
- Simplified table view (hide less important columns)
- Medium padding/spacing

**Desktop (1024px+)**
- Multi-column layouts (3+ columns)
- Full navigation bar
- Table views with all columns
- Sidebars visible
- Standard padding/spacing

---

### 6. ACCESSIBILITY REQUIREMENTS

- Color contrast ratios: WCAG AA minimum (4.5:1 for text)
- Semantic HTML structure (clear hierarchy)
- Focus states visible (keyboard navigation)
- ARIA labels for icons and interactive elements
- Alt text for all images
- Clear button labels
- Error messages linked to form fields
- Loading states indicated (not just visual)

---

### 7. INTERACTION STATES & MICRO-INTERACTIONS

- Button hover: Color shift, slight scale
- Form inputs: Border highlight on focus, error state visual
- Cards: Shadow/elevation on hover
- Modals: Fade-in animation
- Toasts: Slide-in from top/bottom
- Dropdowns: Smooth open/close
- Status badges: Color-coded for quick scanning
- Links: Underline or color change on hover
- Loading: Spinner animation
- Success feedback: Checkmark with animation (optional)

---

### 8. COLOR & VISUAL INDICATORS

**Status Colors:**
- PENDIENTE: Orange (#FFA500 or similar)
- CONFIRMADO: Blue (#4A90E2 or similar)
- ENVIADO: Light Blue (#87CEEB or similar)
- ENTREGADO: Green (#4CAF50 or similar)
- CANCELADO: Red/Gray (#D32F2F or #999999)

**Action Colors:**
- Primary Action: Bold blue or teal
- Secondary Action: Light gray or outline
- Danger/Delete: Red
- Success: Green
- Warning: Orange
- Info: Light blue

---

### 9. DATA & CONTENT REQUIREMENTS

**Product Data Display:**
- Product image (400x400px or scalable)
- Name (max 100 characters, truncate with ellipsis if needed)
- Price (formatted with currency symbol)
- Stock (numeric value with "in stock"/"out of stock" status)
- Unit (KG, L, UNIT, etc.)
- Description (full on detail, truncated on list)
- Category name and/or breadcrumb

**Order Data Display:**
- Order number (bold, monospace font for clarity)
- Dates (formatted consistently: MM/DD/YYYY or DD/MM/YYYY based on region)
- Amounts (formatted with currency symbol and 2 decimals)
- Status (color-coded badge with text)
- Item counts (number of products)
- Addresses (multi-line, clear formatting)

---

### 10. MOBILE APP CONSIDERATIONS

- If native mobile app planned, ensure Figma components are easily handoff-ready
- Include mobile-specific flows (fingerprint login, mobile payment, etc. - future)
- Design mobile bottom navigation (5 main sections for easy thumb reach)

---

## DELIVERABLES

1. **Design System File**:
   - Color palette
   - Typography styles
   - Spacing/grid
   - Component library (all variants)
   - Icons library (SVG-ready)

2. **Client-Side Screens**:
   - Login, Register, Password Recovery
   - Product Catalog (listing + detail)
   - Shopping Cart
   - Checkout (2 steps + confirmation)
   - My Orders (list + detail)
   - User Account/Profile
   - Notifications

3. **Admin-Side Screens**:
   - Dashboard
   - Product Management (list + create/edit form)
   - Category Management (list + create/edit form)
   - Order Management (list + detail + status change)

4. **Component Library**:
   - All reusable components with variants (hover, active, disabled, loading)
   - Responsive variants for mobile/tablet/desktop

5. **Prototypes**:
   - Key user flows (checkout, order management)
   - Navigation flows
   - Form interactions

6. **Style Guide/Documentation**:
   - Brand guidelines
   - Component usage documentation
   - Do's and don'ts

---

## DESIGN TONE & STYLE

- **Modern, Clean, Minimalist**: Avoid clutter; use whitespace effectively
- **User-Centric**: Clear hierarchy, obvious CTAs, easy navigation
- **Professional but Approachable**: Trust-building design for e-commerce
- **Consistent Visual Language**: Unified design across client and admin sections
- **Accessibility-First**: Design for all users, considering color blindness, screen readers, etc.
- **Performance-Aware**: Clean, optimized design (flat design preferred over heavy gradients)

---

## TECHNICAL HANDOFF NOTES

- Export components as individual files or organized library
- Use consistent naming conventions (e.g., Button/Primary, Button/Secondary)
- Include measurement annotations
- Prepare for development (spacing, sizes, font metrics)
- Provide color codes in HEX, RGB, and CSS variable format
- Document all interactive states
- Create a component overview page with usage guidelines

---

## REFERENCE INSPIRATION (Optional)

- Shopify Admin interface (clean, organized, accessible)
- Figma's own design system (modern, professional)
- Stripe Dashboard (clear hierarchy, excellent forms)
- Local e-commerce platforms with good UX
- Modern design systems (Material Design 3, iOS Human Interface Guidelines for reference)

---

## NOTES

- This design should be flexible and scalable (adding new features later)
- Keep performance in mind (optimize images, lazy loading placeholders)
- Design with dark mode in mind (future feature) or provide dark mode variants
- Consider A/B testing friendly designs (e.g., multiple CTA variations)
- Plan for future features: wishlist, reviews, recommendations, live chat support

---

**Total Estimated Screens**: 25-30 main screens with variants
**Complexity Level**: High (comprehensive e-commerce platform)
**Timeline**: 3-4 weeks for professional-grade design system