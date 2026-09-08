const dateFormat = (
  date: Date | string,
  pattern: string = "dd MMM, yyyy",
): string => {
  const dateObj = new Date(date);

  if (pattern === "dd MMM, yyyy") {
    const formatter = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formatter.format(dateObj);
  } else if (pattern === "dd MMMM, yyyy") {
    // Looka template style: 07 JANUARY, 2024
    const day = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(
      dateObj,
    );
    const month = new Intl.DateTimeFormat("en-US", { month: "long" })
      .format(dateObj)
      .toUpperCase();
    const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
      dateObj,
    );

    return `${day} ${month}, ${year}`;
  }

  throw new Error(`Unsupported pattern: ${pattern}`);
};

export default dateFormat;
