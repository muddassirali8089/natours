import mongoose from 'mongoose';
import Tour from '../models/tour.model.js';
import Review from '../models/review.model.js';
import User from '../models/user.model.js';

// 🔍 INDEX ANALYSIS UTILITY (Based on Jonas's course)

export const analyzeIndexes = async () => {
  try {
    console.log('\n🚀 DATABASE INDEX ANALYSIS\n');

    // 1. List all indexes for each collection
    console.log('📊 TOUR COLLECTION INDEXES:');
    const tourIndexes = await Tour.collection.getIndexes();
    console.log(JSON.stringify(tourIndexes, null, 2));

    console.log('\n📊 USER COLLECTION INDEXES:');
    const userIndexes = await User.collection.getIndexes();
    console.log(JSON.stringify(userIndexes, null, 2));

    console.log('\n📊 REVIEW COLLECTION INDEXES:');
    const reviewIndexes = await Review.collection.getIndexes();
    console.log(JSON.stringify(reviewIndexes, null, 2));

    // 2. Get index stats
    console.log('\n📈 INDEX USAGE STATISTICS:');
    
    const tourStats = await Tour.collection.aggregate([
      { $indexStats: {} }
    ]).toArray();
    
    console.log('Tour Index Stats:', JSON.stringify(tourStats, null, 2));

    return {
      tourIndexes,
      userIndexes,
      reviewIndexes,
      tourStats
    };

  } catch (error) {
    console.error('Error analyzing indexes:', error);
  }
};

// 🏃‍♂️ QUERY PERFORMANCE TESTING
export const testQueryPerformance = async () => {
  try {
    console.log('\n⚡ QUERY PERFORMANCE TESTING\n');

    // Test 1: Get tours with price filtering (should use price index)
    console.time('Price Filter Query');
    const expensiveTours = await Tour.find({ price: { $gte: 1000 } }).explain('executionStats');
    console.timeEnd('Price Filter Query');
    console.log('Price Filter - Execution Stats:', expensiveTours.executionStats);

    // Test 2: Get tours sorted by ratings (should use ratingsAverage index)
    console.time('Ratings Sort Query');
    const topRatedTours = await Tour.find().sort({ ratingsAverage: -1 }).limit(5).explain('executionStats');
    console.timeEnd('Ratings Sort Query');
    console.log('Ratings Sort - Execution Stats:', topRatedTours.executionStats);

    // Test 3: Text search (should use text index)
    console.time('Text Search Query');
    const searchResults = await Tour.find({ $text: { $search: 'adventure' } }).explain('executionStats');
    console.timeEnd('Text Search Query');
    console.log('Text Search - Execution Stats:', searchResults.executionStats);

    // Test 4: Compound query (should use compound index)
    console.time('Compound Query');
    const compoundResults = await Tour.find({
      price: { $lte: 1500 },
      ratingsAverage: { $gte: 4.5 },
      difficulty: 'easy'
    }).explain('executionStats');
    console.timeEnd('Compound Query');
    console.log('Compound Query - Execution Stats:', compoundResults.executionStats);

  } catch (error) {
    console.error('Error testing query performance:', error);
  }
};

// 📊 INDEX RECOMMENDATIONS
export const getIndexRecommendations = () => {
  console.log('\n💡 INDEX OPTIMIZATION RECOMMENDATIONS:\n');
  
  const recommendations = [
    '1. 🎯 MOST IMPORTANT INDEXES (Already implemented):',
    '   - Tours: { ratingsAverage: -1, price: 1, difficulty: 1 }',
    '   - Users: { email: 1 } (unique)',
    '   - Reviews: { tour: 1, user: 1 } (unique)',
    '',
    '2. 🔍 TEXT SEARCH INDEXES:',
    '   - Tours: Full-text search on name, summary, description',
    '   - Reviews: Text search on review content',
    '   - Users: Text search on names',
    '',
    '3. 🌍 GEOSPATIAL INDEXES:',
    '   - Tours: 2dsphere index on startLocation for location queries',
    '',
    '4. 📅 DATE-BASED INDEXES:',
    '   - Tours: startDates for monthly plan aggregations',
    '   - Reviews: createdAt for chronological sorting',
    '',
    '5. 🔒 SECURITY INDEXES:',
    '   - Users: Password reset and email verification tokens',
    '',
    '6. ⚡ PERFORMANCE TIPS:',
    '   - Use .explain("executionStats") to analyze query performance',
    '   - Monitor index usage with db.collection.aggregate([{$indexStats:{}}])',
    '   - Remove unused indexes to save storage and improve write performance',
    '   - Use compound indexes for queries with multiple filters'
  ];

  recommendations.forEach(rec => console.log(rec));
};

// 🧪 COMPREHENSIVE INDEX TEST
export const runCompleteIndexAnalysis = async () => {
  console.log('🔬 RUNNING COMPLETE INDEX ANALYSIS...\n');
  
  await analyzeIndexes();
  await testQueryPerformance();
  getIndexRecommendations();
  
  console.log('\n✅ INDEX ANALYSIS COMPLETE!');
};

export default {
  analyzeIndexes,
  testQueryPerformance,
  getIndexRecommendations,
  runCompleteIndexAnalysis
}; 