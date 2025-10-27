import express from 'express';
import Review from '../models/Review';

const router = express.Router();

// Submit a new review
router.post('/submit', async (req, res) => {
  try {
    const { name, role, company, rating, review } = req.body;

    // Validation
    if (!name || !role || !rating || !review) {
      return res.status(400).json({ 
        message: 'Name, role, rating, and review are required fields' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    if (review.length > 1000) {
      return res.status(400).json({ 
        message: 'Review must be less than 1000 characters' 
      });
    }

    // Create new review
    const newReview = new Review({
      name: name.trim(),
      role: role.trim(),
      company: company ? company.trim() : undefined,
      rating: parseInt(rating),
      review: review.trim(),
      isApproved: false // Reviews start as unapproved
    });

    await newReview.save();

    res.status(201).json({
      message: 'Review submitted successfully! It will be reviewed before publication.',
      success: true
    });

  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ 
      message: 'Error submitting review. Please try again.' 
    });
  }
});

// Get approved reviews (public endpoint)
router.get('/approved', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Review.countDocuments({ isApproved: true });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      message: 'Error fetching reviews' 
    });
  }
});

// Get review statistics
router.get('/stats', async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments({ isApproved: true });
    
    const ratingStats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: []
    };

    // Calculate rating distribution
    const distribution = [1, 2, 3, 4, 5].map(rating => {
      const count = stats.ratingDistribution.filter((r: number) => r === rating).length;
      return {
        rating,
        count,
        percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
      };
    });

    res.json({
      totalReviews,
      averageRating: Math.round(stats.averageRating * 10) / 10,
      distribution
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching review statistics' 
    });
  }
});

// Approve a review (for testing - should be protected with admin auth in production)
router.patch('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review approved successfully',
      review
    });

  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ 
      message: 'Error approving review' 
    });
  }
});

// Get all reviews (including unapproved ones) - for admin
router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Review.countDocuments();
    const approved = await Review.countDocuments({ isApproved: true });
    const pending = await Review.countDocuments({ isApproved: false });

    res.json({
      reviews,
      stats: {
        total,
        approved,
        pending
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ 
      message: 'Error fetching reviews' 
    });
  }
});

export default router;