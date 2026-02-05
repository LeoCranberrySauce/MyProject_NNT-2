# Advanced Home Page Implementation Guide

## 🎯 Quick Start

The home page has been enhanced with 6 new advanced components and the FoodDisplay component has been updated with intelligent filtering and sorting.

---

## 📦 New Components Summary

| Component | Purpose | Location |
|-----------|---------|----------|
| **AdvancedSearch** | Search & filter functionality | `/components/AdvancedSearch/` |
| **TrendingSection** | Showcase trending items | `/components/TrendingSection/` |
| **PromotionalBanner** | Display promotional offers | `/components/PromotionalBanner/` |
| **LocationDeals** | GPS-based location deals | `/components/LocationDeals/` |
| **RecentReviews** | Customer reviews carousel | `/components/RecentReviews/` |
| **PersonalizedRecommendations** | Smart recommendations | `/components/PersonalizedRecommendations/` |

---

## 🚀 Current Features

### ✅ Search & Filtering
- Real-time search by food name or description
- Price range filtering with slider
- 5 sorting options (Popular, Price, Rating, Newest)
- Clear filters functionality

### ✅ Trending Section
- Auto-rotating carousel (5-second interval)
- Manual navigation with dots
- Shows growth trends
- Custom badges for different item types

### ✅ Promotions
- Multiple promotional banners
- Copy promo codes to clipboard
- Auto-rotating (6-second interval)
- Manual navigation with arrows

### ✅ Location Features
- Shows GPS-based location
- Location-specific deals
- 3 deal types per location
- Only displays when location is available

### ✅ Social Proof
- Customer reviews with avatars
- Star ratings and review counts
- Horizontal scrollable carousel
- Timestamps and helpful buttons

### ✅ Recommendations
- AI-like smart recommendations
- Based on cart items
- Category matching
- Fallback to random items if cart is empty

### ✅ Enhanced Food Display
- Dynamic filtering based on search/price/sort
- Item count indicator
- Empty state handling
- Smooth animations

---

## 🔌 Integration Steps

### 1. Update Backend (When Ready)

**Trending Items Endpoint** - `GET /api/trending`
```javascript
Response: [{
  id, name, rating, reviews, trend, badge
}]
```

**Fetch and use in TrendingSection.jsx**:
```jsx
useEffect(() => {
  fetch('/api/trending')
    .then(res => res.json())
    .then(data => setTrendingItems(data))
}, [])
```

### 2. Update Promotions

**Promotions Endpoint** - `GET /api/promotions`
```javascript
Response: [{
  id, title, subtitle, code, discount, color
}]
```

### 3. Update Reviews

**Reviews Endpoint** - `GET /api/reviews`
```javascript
Response: [{
  id, author, rating, text, food, avatar, time
}]
```

### 4. Location-Based Features

Use existing StoreContext's `userLocation`:
```jsx
if (userLocation) {
  // LocationDeals component will automatically show
}
```

### 5. Recommendations Algorithm

Current: Category-based matching
For improvement, add to backend:
- User behavior tracking
- Collaborative filtering
- Item similarity scores

---

## 🛠️ Customization Guide

### Change Color Scheme

Update gradient colors in CSS files:
```css
/* Primary Purple → Change these */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* To any colors you want */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Adjust Carousel Timing

**TrendingSection.jsx**:
```jsx
const timer = setInterval(() => {
  setActiveIndex(prev => (prev + 1) % trendingItems.length)
}, 5000)  // Change 5000 to milliseconds you want
```

**PromotionalBanner.jsx**:
```jsx
const timer = setInterval(() => {
  setCurrentBanner(prev => (prev + 1) % banners.length)
}, 6000)  // Change timing here
```

### Modify Price Filter Range

**Home.jsx**:
```jsx
const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
// Change max: 10000 to your desired range
```

### Change Sort Options

**AdvancedSearch.jsx** - Update select options:
```jsx
<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
  <option value='your-option'>Your Option Label</option>
</select>
```

Then handle in **FoodDisplay.jsx**:
```jsx
case 'your-option':
  items.sort((a, b) => /* your logic */)
  break
```

---

## 🎨 Responsive Breakpoints

- **Desktop**: 1024px+ (full features)
- **Tablet**: 768px - 1023px (adjusted spacing)
- **Mobile**: Below 768px (simplified layout)
- **Small Mobile**: Below 480px (minimal layout)

All components use these breakpoints in their CSS files.

---

## 🔍 Component Props Reference

### AdvancedSearch
```jsx
<AdvancedSearch 
  searchQuery={string}
  setSearchQuery={function}
  priceFilter={{ min: number, max: number }}
  setPriceFilter={function}
  sortBy={string}
  setSortBy={function}
/>
```

### FoodDisplay (Enhanced)
```jsx
<FoodDisplay 
  category={string}
  searchQuery={string}
  priceFilter={{ min: number, max: number }}
  sortBy={string}
/>
```

### TrendingSection
```jsx
<TrendingSection 
  onClose={() => {/* handle close */}}
/>
```

### LocationDeals
```jsx
<LocationDeals />
// Uses StoreContext's userLocation
```

### RecentReviews
```jsx
<RecentReviews />
// Self-contained, hardcoded data
```

### PromotionalBanner
```jsx
<PromotionalBanner />
// Self-contained, hardcoded data
```

### PersonalizedRecommendations
```jsx
<PersonalizedRecommendations />
// Uses StoreContext's food_list and cartItems
```

---

## 🧪 Testing Checklist

- [ ] Search filters items correctly
- [ ] Price slider updates filter in real-time
- [ ] Sort options work for all categories
- [ ] Trending carousel rotates every 5 seconds
- [ ] Manual carousel navigation works
- [ ] Promo code copy functionality works
- [ ] Location deals only show when location exists
- [ ] Reviews carousel scrolls smoothly
- [ ] Recommendations change with cart items
- [ ] All responsive breakpoints work
- [ ] No console errors
- [ ] Page loads quickly

---

## 📊 State Flow

```
Home Component
├── category (string)
├── searchQuery (string)
├── priceFilter (object)
├── sortBy (string)
└── showTrending (boolean)
    ↓
    Passed to child components
    for filtering and display
```

---

## 🐛 Common Issues & Solutions

### Issue: Images not loading
**Solution**: Check image paths in backend. Ensure images are properly hosted.

### Issue: Reviews not scrolling
**Solution**: Ensure parent container has fixed width. Check CSS overflow properties.

### Issue: Filters not working
**Solution**: Verify FoodDisplay receives all props from Home. Check console for errors.

### Issue: Recommendations showing wrong items
**Solution**: Verify StoreContext provides correct cartItems and food_list.

### Issue: Slow performance
**Solution**: Check for unnecessary re-renders. Use React DevTools Profiler.

---

## 📚 File Structure

```
frontend/src/
├── pages/
│   └── Home/
│       ├── Home.jsx (UPDATED)
│       └── Home.css (UPDATED)
│
├── components/
│   ├── AdvancedSearch/ (NEW)
│   │   ├── AdvancedSearch.jsx
│   │   └── AdvancedSearch.css
│   │
│   ├── TrendingSection/ (NEW)
│   │   ├── TrendingSection.jsx
│   │   └── TrendingSection.css
│   │
│   ├── PromotionalBanner/ (NEW)
│   │   ├── PromotionalBanner.jsx
│   │   └── PromotionalBanner.css
│   │
│   ├── LocationDeals/ (NEW)
│   │   ├── LocationDeals.jsx
│   │   └── LocationDeals.css
│   │
│   ├── RecentReviews/ (NEW)
│   │   ├── RecentReviews.jsx
│   │   └── RecentReviews.css
│   │
│   ├── PersonalizedRecommendations/ (NEW)
│   │   ├── PersonalizedRecommendations.jsx
│   │   └── PersonalizedRecommendations.css
│   │
│   └── FoodDisplay/ (UPDATED)
│       ├── FoodDisplay.jsx
│       └── FoodDisplay.css
```

---

## 💾 Next Steps

1. **Backend Integration**: Connect hardcoded data to real APIs
2. **Testing**: Test all features thoroughly
3. **Performance**: Monitor and optimize if needed
4. **Analytics**: Add tracking for user interactions
5. **User Feedback**: Gather feedback and iterate

---

## 📞 Support

For detailed information about each component, see: `ADVANCED_HOME_PAGE_FEATURES.md`

---

**Status**: ✅ Implementation Complete & Ready to Test
**Last Updated**: January 30, 2026
