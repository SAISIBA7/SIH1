'use client';

import React, { useState, useEffect } from 'react';
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
  const [equipmentData, setEquipmentData] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    fetch('/api/equipment')
      .then((res) => res.json())
      .then((data) => setEquipmentData(data))
      .catch((err) => console.error('Failed to load equipment:', err));
  }, []);

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




