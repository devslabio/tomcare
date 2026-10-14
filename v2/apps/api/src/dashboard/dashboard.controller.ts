import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Staff } from "../auth/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";

const DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Calendar date in Montréal as YYYY-MM-DD (handles daylight saving). */
function montrealDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(date);
}

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Staff()
  async summary() {
    const since = new Date(Date.now() - DAYS * DAY_MS);
    const now = new Date();
    const [
      newMessages,
      newVolunteers,
      newRequests,
      newDonations,
      subscribers,
      programs,
      upcomingEvents,
      posts,
      pages,
      recentRequests,
      recentVolunteers,
      recentMessages,
      messageDates,
      volunteerDates,
      requestDates,
      requestNeeds,
    ] = await Promise.all([
      this.prisma.contactMessage.count({ where: { status: "NEW" } }),
      this.prisma.volunteerApplication.count({ where: { status: "NEW" } }),
      this.prisma.assistanceRequest.count({ where: { status: "NEW" } }),
      this.prisma.donationPledge.count({ where: { status: "NEW" } }),
      this.prisma.subscriber.count(),
      this.prisma.program.count({ where: { visible: true } }),
      this.prisma.event.count({ where: { visible: true, startsAt: { gte: now } } }),
      this.prisma.post.count({ where: { status: "PUBLISHED" } }),
      this.prisma.page.count({ where: { status: "PUBLISHED" } }),
      this.prisma.assistanceRequest.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, city: true, needs: true, status: true, createdAt: true },
      }),
      this.prisma.volunteerApplication.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, role: true, status: true, createdAt: true },
      }),
      this.prisma.contactMessage.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, subject: true, status: true, createdAt: true },
      }),
      this.prisma.contactMessage.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.volunteerApplication.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.assistanceRequest.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.assistanceRequest.findMany({ where: { createdAt: { gte: since } }, select: { needs: true } }),
    ]);

    const tally = (rows: { createdAt: Date }[]) => {
      const counts = new Map<string, number>();
      for (const { createdAt } of rows) counts.set(montrealDay(createdAt), (counts.get(montrealDay(createdAt)) ?? 0) + 1);
      return counts;
    };
    const [messagesByDay, volunteersByDay, requestsByDay] = [tally(messageDates), tally(volunteerDates), tally(requestDates)];
    const activity = Array.from({ length: DAYS }, (_, index) => {
      const date = montrealDay(new Date(Date.now() - (DAYS - 1 - index) * DAY_MS));
      return {
        date,
        messages: messagesByDay.get(date) ?? 0,
        volunteers: volunteersByDay.get(date) ?? 0,
        requests: requestsByDay.get(date) ?? 0,
      };
    });

    const needCounts = new Map<string, number>();
    for (const { needs } of requestNeeds) for (const need of needs) needCounts.set(need, (needCounts.get(need) ?? 0) + 1);
    const topNeeds = [...needCounts]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([key, value]) => ({ key, value }));

    return {
      inbox: { messages: newMessages, volunteers: newVolunteers, requests: newRequests, donations: newDonations },
      subscribers,
      content: { programs, upcomingEvents, posts, pages },
      recentRequests,
      recentVolunteers,
      recentMessages,
      activity,
      topNeeds,
    };
  }
}
