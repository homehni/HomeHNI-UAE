# Direct Reject Feature with "REJECTED" Watermark

## ✅ Feature Implemented

Admin can now **directly reject properties** from the 3-dot menu, and rejected properties will display a **"REJECTED" watermark** on the owner's dashboard and property pages.

---

## 🎯 How It Works

### Admin Side:
1. Go to **Admin Portal** → **Listings Management**
2. Find an **approved property**
3. Click **3-dot menu (⋯)**
4. Click **"Reject"** (orange)
5. ✅ **Property is immediately marked as rejected**
6. ✅ **No modal appears** - instant action
7. ✅ **Toast notification** confirms rejection

### Owner Side:
1. Owner goes to **Dashboard** → **Your Properties**
2. ✅ **Rejected property shows "REJECTED" watermark** (orange overlay)
3. Owner can see their property but cannot edit or reactivate it
4. Property is **hidden from public search**

---

## 📋 Changes Made

### 1. **AdminProperties.tsx** - Direct Reject Handler

**Added `handleDirectReject` function:**
```typescript
const handleDirectReject = async (property: PropertySubmission) => {
  // Updates property status to 'rejected' in database
  // Works for both regular submissions and edited properties
  // No modal - instant rejection
  // Shows toast notification
  // Refreshes property list
};
```

**Key Features:**
- ✅ No modal required
- ✅ Updates both `property_submissions` and `properties` tables
- ✅ Sets `rejection_reason` to "Rejected by admin"
- ✅ Shows success toast
- ✅ Refreshes list automatically

### 2. **PropertyWatermark.tsx** - Added Rejected Status

**Added 'rejected' to watermark types:**
```typescript
interface PropertyWatermarkProps {
  status: 'available' | 'inactive' | 'rented' | 'sold' | 'rejected';
}
```

**Watermark Configuration:**
- **Text**: "REJECTED"
- **Color**: Orange (`text-orange-600`)
- **Overlay**: Orange transparent (`bg-orange-600/20`)
- **Border**: Orange (`border-orange-600`)
- **Style**: Rotated -20 degrees, bold, large text

### 3. **PropertyCard.tsx** - Property Status Support

**Added `property_status` prop:**
```typescript
property_status?: 'approved' | 'rejected' | 'pending';
```

**Priority Logic:**
```typescript
const watermarkStatus = property_status === 'rejected' ? 'rejected' : rental_status;
```

- If property is `rejected`, watermark shows "REJECTED"
- Otherwise, shows rental status (rented/sold/available)
- Rejected status takes priority

### 4. **PropertyTable.tsx** - Event Propagation Fix

**Added `e.stopPropagation()` to prevent unintended modal opens:**
```typescript
onClick={(e) => {
  e.stopPropagation();
  onReject(property);
}}
```

---

## 🎨 Visual Design

### Watermark Comparison:

| Status | Text | Color | Border | Overlay |
|--------|------|-------|--------|---------|
| RENTED | RENTED | Red | Red | Red 20% |
| SOLD | SOLD | Green | Green | Green 20% |
| **REJECTED** | **REJECTED** | **Orange** | **Orange** | **Orange 20%** |

### Example Display:
```
┌────────────────────────────┐
│      ╱╱╱╱╱╱╱╱╱╱╱╱╱        │
│     ╱  REJECTED  ╱         │
│    ╱    (Orange)  ╱        │
│   ╱╱╱╱╱╱╱╱╱╱╱╱╱╱          │
│  [Property Image Below]    │
└────────────────────────────┘
```

---

## 📊 Database Updates

### Tables Affected:

**1. `property_submissions` table:**
```sql
UPDATE property_submissions
SET 
  status = 'rejected',
  payload = {
    ...existing_data,
    rejection_reason: 'Rejected by admin'
  },
  updated_at = NOW()
WHERE id = property_id;
```

**2. `properties` table:**
```sql
UPDATE properties
SET 
  status = 'rejected',
  rejection_reason = 'Rejected by admin'
WHERE id = property_id;
```

---

## 🔄 Status Flow

```
New Property
    ↓
Auto-Approved ✅
    ↓
Admin clicks "Reject" in 3-dot menu
    ↓
Instant Rejection (no modal)
    ↓
Status = 'rejected' in database
    ↓
"REJECTED" watermark appears on owner's view
    ↓
Hidden from public search
```

---

## ✅ Features

### Admin Actions:
- ✅ **One-click reject** from 3-dot menu
- ✅ **No confirmation modal** (instant)
- ✅ **Visual feedback** (toast notification)
- ✅ **Auto-refresh** property list
- ✅ **Works for all property types**

### Owner Experience:
- ✅ **Visible watermark** on their dashboard
- ✅ **Clear rejection status** (orange overlay)
- ✅ **Can view property** but cannot edit
- ✅ **Property hidden** from public listings
- ✅ **Rejection reason** stored in database

### System Behavior:
- ✅ **Updates both tables** (submissions & properties)
- ✅ **Maintains data integrity**
- ✅ **Reversible** (admin can re-approve later)
- ✅ **No data loss** (property data preserved)

---

## 🧪 Testing

### Test 1: Admin Reject Property
1. Login as **Admin**
2. Go to **Listings Management**
3. Find an **approved property**
4. Click **3-dot menu**
5. Click **"Reject"** (orange)
6. ✅ Property status changes to "Rejected"
7. ✅ Toast appears: "Property Rejected"
8. ✅ Property moves to "Rejected" filter

### Test 2: Owner Sees Watermark
1. Login as **property owner**
2. Go to **Dashboard** → **Your Properties**
3. Find the **rejected property**
4. ✅ Property shows **"REJECTED" watermark** (orange)
5. ✅ Property is still visible in owner's list
6. ✅ Cannot activate or edit

### Test 3: Public Cannot See
1. **Logout** (or use incognito)
2. Go to **Search** or **Home page**
3. Search for the rejected property
4. ✅ **Property does NOT appear** in results
5. ✅ Direct URL access may show "Not available"

### Test 4: Re-Approval
1. Admin goes to **Listings Management**
2. Filter by **"Rejected"**
3. Click **rejected property**
4. Click **"Approve"** button
5. ✅ Status changes back to "Approved"
6. ✅ Watermark disappears
7. ✅ Property appears in public search again

---

## 🔧 Technical Details

### Event Flow:
1. Admin clicks "Reject" → `handleDirectReject()` called
2. Function updates database (2 tables)
3. Toast notification shown
4. Property list refreshed
5. Owner's dashboard shows watermark on next load

### Watermark Rendering:
1. PropertyCard receives `property_status` prop
2. Determines watermark status: `rejected` > `rental_status`
3. Passes to `PropertyWatermark` component
4. Component renders orange overlay with "REJECTED" text

### Database Consistency:
- Both `property_submissions` and `properties` tables updated
- Rejection reason stored for audit trail
- Status synchronized across tables
- Trigger handles any conflicts

---

## 📝 Summary

| Feature | Status | Details |
|---------|--------|---------|
| Direct Reject | ✅ Done | No modal, instant action |
| REJECTED Watermark | ✅ Done | Orange overlay, rotated text |
| Database Update | ✅ Done | Both tables updated |
| Owner Visibility | ✅ Done | Watermark on dashboard |
| Public Hidden | ✅ Done | Filtered from search |
| Reversible | ✅ Done | Can re-approve later |

---

## 🎉 Benefits

1. **Faster Moderation**: One click vs multiple steps
2. **Clear Communication**: Visual watermark shows status
3. **Owner Awareness**: Can see rejection immediately
4. **Audit Trail**: Rejection reason stored
5. **Reversible**: Can undo if mistake
6. **Professional**: Clean orange branding

**The feature is now live and ready to use!** 🚀

