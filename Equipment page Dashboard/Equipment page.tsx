'use client';

import React, { useState } from 'react';
import styles from './EquipmentPage.module.css';

interface EquipmentItem {
  id: string;
  category: string;
  categorySlug: string;
  provider: string;
  availability: string;
  matchScore: string;
  icon: string;
  name: string;
  specs: string;
  rate: string;
  unit: string;
  distance: string;
  features: string[];
}

const equipmentData: EquipmentItem[] = [
  {
    id: 'tractor',
    category: 'HEAVY MACHINERY',
    categorySlug: 'heavy',
    provider: 'Mahindra Farm Implements',
    availability: 'Available Now',
    matchScore: '98% match',
    icon: '🚜',
    name: 'Tractor (55 HP)',
    specs: '4WD • Mahindra DI 575',
    rate: '₹900',
    unit: '/hour',
    distance: '5 km away',
    features: ['Professional driver/operator included', 'Full fuel tank on delivery'],
  },
  {
    id: 'seeder',
    category: 'SOWING & PLANTING',
    categorySlug: 'sowing',
    provider: 'Odisha Agro Implements',
    availability: 'Available Now',
    matchScore: '95% match',
    icon: '🌱',
    name: 'Automatic Seeder',
    specs: 'Multi-Crop 9-Tyne Seed Drill',
    rate: '₹500',
    unit: '/hour',
    distance: '3 km away',
    features: ['Precise calibrated seed drop', 'Fits standard 3-point hitch'],
  },
  {
    id: 'pump',
    category: 'IRRIGATION SUPPORT',
    categorySlug: 'irrigation',
    provider: 'Surya Solar Systems',
    availability: 'Available Today',
    matchScore: '92% match',
    icon: '💧',
    name: 'Solar Water Pump',
    specs: '5 HP High Flow Rate Submersible',
    rate: '₹300',
    unit: '/day',
    distance: '2 km away',
    features: ['50m heavy-duty discharge pipe', 'Zero power cost • Direct solar'],
  },
  {
    id: 'harvester',
    category: 'HARVESTING',
    categorySlug: 'harvesting',
    provider: 'Mayurbhanj Custom Hiring',
    availability: 'Available Now',
    matchScore: '96% match',
    icon: '🌾',
    name: 'Combine Harvester',
    specs: 'Multi-Crop • Self-Propelled 4WD',
    rate: '₹1,800',
    unit: '/hour',
    distance: '8 km away',
    features: ['Licensed experienced operator', '2-Tonne grain tank capacity'],
  },
  {
    id: 'rotavator',
    category: 'TILLAGE & PLOUGHING',
    categorySlug: 'tillage',
    provider: 'Krushak Seva Kendra',
    availability: 'Available Today',
    matchScore: '94% match',
    icon: '⚙️',
    name: 'Heavy Rotavator',
    specs: '6 Feet • 48 Boron Steel Blades',
    rate: '₹450',
    unit: '/hour',
    distance: '4 km away',
    features: ['Ultra-fine soil pulverization', 'Heavy-duty multi-speed gearbox'],
  },
  {
    id: 'sprayer',
    category: 'CROP PROTECTION',
    categorySlug: 'spraying',
    provider: 'GreenShield Agro Tools',
    availability: 'Available Now',
    matchScore: '90% match',
    icon: '💨',
    name: 'Power Boom Sprayer',
    specs: '500L Tank • 24 Adjustable Nozzles',
    rate: '₹400',
    unit: '/hour',
    distance: '3.5 km away',
    features: ['Uniform chemical spray coverage', 'Tractor PTO-operated pump'],
  },
];

const categories = [
  { label: 'All Equipment', slug: 'all', count: 6 },
  { label: 'Heavy Machinery', slug: 'heavy', count: 1 },
  { label: 'Sowing & Planting', slug: 'sowing', count: 1 },
  { label: 'Irrigation Support', slug: 'irrigation', count: 1 },
  { label: 'Harvesting', slug: 'harvesting', count: 1 },
  { label: 'Tillage & Care', slug: 'tillage-care', count: 2 },
];

export default function EquipmentPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredEquipment = equipmentData.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'tillage-care') return item.categorySlug === 'tillage' || item.categorySlug === 'spraying';
    return item.categorySlug === activeCategory;
  });

  return (
    <section className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        {/* Top Header Card / Banner */}
        <div className={styles.bannerCard}>
          <div className={styles.bannerTop}>
            <div className={styles.bannerBrand}>
              <span className={styles.appBadge}>
                <span className={styles.appBadgeIcon}>🌾</span>
                Smart Crop • Equipment & Machinery
              </span>
              <span className={styles.verifiedPill}>
                <span className={styles.statusDot} />
                Verified Local Equipment
              </span>
            </div>
            <span className={styles.districtTag}>📍 Mayurbhanj District</span>
          </div>

          <div className={styles.bannerMain}>
            <h1 className={styles.heading}>Equipment Rental Directory</h1>
            <p className={styles.bannerSubtitle}>
              Explore verified agricultural machinery available for rent with transparent rates and instant booking.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className={styles.filterSection}>
            <span className={styles.filterLabel}>FILTER BY CATEGORY</span>
            <div className={styles.filterPills}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    className={isActive ? styles.filterPillActive : styles.filterPill}
                    onClick={() => setActiveCategory(cat.slug)}
                  >
                    {cat.label} <span className={styles.filterCount}>({cat.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3-Column Spacious Glass Card Grid */}
        <div className={styles.cardsGrid}>
          {filteredEquipment.map((item) => (
            <article key={item.id} className={styles.card}>
              {/* Card Meta Row */}
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <span className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  {item.matchScore}
                </span>
              </div>

              {/* Title & Icon Section */}
              <div className={styles.titleSection}>
                <span className={styles.icon}>{item.icon}</span>
                <div className={styles.titleText}>
                  <h2 className={styles.cardTitle}>{item.name}</h2>
                  <span className={styles.cardSpecs}>{item.specs}</span>
                </div>
              </div>

              {/* Highlight Rate & Distance Box */}
              <div className={styles.priceBox}>
                <div className={styles.rateCol}>
                  <span className={styles.rateLabel}>RENTAL RATE</span>
                  <div className={styles.rateValueRow}>
                    <span className={styles.rateAmount}>{item.rate}</span>
                    <span className={styles.rateUnit}>{item.unit}</span>
                  </div>
                </div>
                <div className={styles.distanceCol}>
                  <span className={styles.distanceChip}>📍 {item.distance}</span>
                  <span className={styles.providerLabel}>{item.provider}</span>
                </div>
              </div>

              {/* Feature Highlights Checklist */}
              <ul className={styles.featureList}>
                {item.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Signature Action Button */}
              <button type="button" className={styles.rentButton}>
                Rent Now
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}




