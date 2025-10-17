# Quick Guide: Admin Reject Feature

## ✅ **Feature Added Successfully!**

Admins can now **reject approved properties** from the Listings Management page.

---

## 🎯 **How to Use**

### Step 1: Find an Approved Property
- Go to **Admin Portal** → **Listings Management**
- Look for properties with **"Approved"** badge (green)

### Step 2: Open Actions Menu
- Click the **3-dot menu (⋯)** in the "Actions" column

### Step 3: Click "Reject"
You'll now see:
```
┌─────────────────────────┐
│ 👁️ View Details        │
│ ❌ Reject              │  ← NEW!
│ 🗑️ Delete              │
└─────────────────────────┘
```

### Step 4: Enter Rejection Reason
- Modal opens asking for reason
- Type why you're rejecting (e.g., "Duplicate listing", "Incorrect info")
- Click **"Confirm"**

### Step 5: Property is Rejected
- ✅ Status changes to "Rejected"
- ✅ Hidden from public search
- ✅ Owner is notified (if emails enabled)
- ✅ Still visible in admin panel for review

---

## 🎨 **Visual Differences**

| Menu Item | Icon | Color | Shows For |
|-----------|------|-------|-----------|
| View Details | 👁️ | Default | All properties |
| **Reject** | ❌ | **Orange** | **Approved only** |
| Delete | 🗑️ | Red | Non-deleted properties |

---

## 🔄 **Status Flow**

```
Auto-Approved Property
         ↓
    ✅ Approved
         ↓
   Admin clicks "Reject"
         ↓
    ❌ Rejected
         ↓
   (Can be re-approved later)
```

---

## ✅ **What Changed**

| Before | After |
|--------|-------|
| Could only Delete approved properties | Can Reject (soft) OR Delete (hard) |
| No way to mark as rejected from list | Click "Reject" directly from menu |
| Had to open modal first | Quick access via 3-dot menu |

---

## 🚀 **Test It Now**

1. **Hard refresh** your browser: `Ctrl + Shift + R`
2. Go to **Admin Portal** → **Listings Management**
3. Find the **Commercial Retail Space** (approved)
4. Click **3-dot menu**
5. ✅ You should see **"Reject"** option in orange!

---

## 💡 **Use Cases**

### When to Reject:
- ✅ Duplicate listings
- ✅ Incorrect property information
- ✅ Policy violations
- ✅ Spam or low-quality content
- ✅ Outdated listings

### When to Delete:
- ❌ Permanent removal only
- ❌ When property should never be visible again
- ❌ Fraudulent listings

**Tip**: Use "Reject" for most cases - it's reversible!

---

## 🎯 **Summary**

**What**: "Reject" option added to 3-dot menu  
**Where**: Admin Listings Management  
**Who**: Admin users only  
**When**: For approved properties  
**Why**: Better moderation control  

**Status**: ✅ Ready to use now!

---

## 🆘 **Troubleshooting**

### Don't see "Reject" option?
1. ✅ Check property status is "Approved"
2. ✅ Hard refresh browser
3. ✅ Check you're logged in as admin

### "Reject" is grayed out?
- Wait for current action to complete
- Button is disabled during processing

### Want to re-approve?
- Click "View Details" → "Approve" button
- Status changes back to "Approved"

---

**All set!** The feature is live and ready to use. 🎉

