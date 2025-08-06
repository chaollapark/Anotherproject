import { NextRequest, NextResponse } from 'next/server';
import { sendDailyJobEmails, addSubscriber, unsubscribe, getSubscriberCount } from '@/lib/dailyEmailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, preferences } = body;

    switch (action) {
      case 'send_daily_emails':
        const stats = await sendDailyJobEmails();
        return NextResponse.json({
          success: true,
          message: 'Daily emails sent successfully',
          stats
        });

      case 'add_subscriber':
        if (!email) {
          return NextResponse.json({
            success: false,
            message: 'Email is required'
          }, { status: 400 });
        }

        const subscriber = await addSubscriber(email, preferences);
        return NextResponse.json({
          success: true,
          message: 'Subscriber added successfully',
          subscriber
        });

      case 'unsubscribe':
        if (!email) {
          return NextResponse.json({
            success: false,
            message: 'Email is required'
          }, { status: 400 });
        }

        const unsubscribed = await unsubscribe(email);
        return NextResponse.json({
          success: unsubscribed,
          message: unsubscribed ? 'Unsubscribed successfully' : 'Failed to unsubscribe'
        });

      case 'get_subscriber_count':
        const count = await getSubscriberCount();
        return NextResponse.json({
          success: true,
          count
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Daily emails API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint to manually trigger daily emails (for testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'send_daily_emails') {
      const stats = await sendDailyJobEmails();
      return NextResponse.json({
        success: true,
        message: 'Daily emails sent successfully',
        stats
      });
    }

    if (action === 'get_subscriber_count') {
      const count = await getSubscriberCount();
      return NextResponse.json({
        success: true,
        count
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action or no action specified'
    }, { status: 400 });

  } catch (error) {
    console.error('Daily emails API GET error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
} 