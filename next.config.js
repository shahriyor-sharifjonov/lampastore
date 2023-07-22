module.exports = {
  images: {
    domains: [
      'res.cloudinary.com',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  }
}