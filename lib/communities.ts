import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  setDoc,
  serverTimestamp,
  increment,
  updateDoc
} from "firebase/firestore";
import { Community, CommunityMember, UserRole } from "@/types";
import * as turf from "@turf/turf";

const COMMUNITIES_COLLECTION = "communities";
const MEMBERS_COLLECTION = "community_members";

/**
 * Creates a new community with geo-fenced boundaries
 */
export async function createCommunity(communityData: Omit<Community, "id" | "createdAt" | "memberCount" | "activeAlerts">) {
  const docRef = await addDoc(collection(db, COMMUNITIES_COLLECTION), {
    ...communityData,
    createdAt: serverTimestamp(),
    memberCount: 0,
    activeAlerts: 0,
  });
  return docRef.id;
}

/**
 * Fetches all communities
 */
export async function getCommunities(): Promise<Community[]> {
  const snapshot = await getDocs(collection(db, COMMUNITIES_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
}

/**
 * Fetches a single community by ID
 */
export async function getCommunityById(id: string): Promise<Community | null> {
  const docRef = doc(db, COMMUNITIES_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Community) : null;
}

/**
 * Finds which community a coordinate point belongs to using Turf.js
 */
export async function findCommunityByPoint(lat: number, lng: number): Promise<Community | null> {
  const communities = await getCommunities();
  const point = turf.point([lng, lat]); // Turf uses [lng, lat]

  for (const community of communities) {
    if (community.polygonCoordinates) {
      try {
        const polygon = turf.polygon(community.polygonCoordinates.coordinates);
        if (turf.booleanPointInPolygon(point, polygon)) {
          return community;
        }
      } catch (error) {
        console.error(`Error processing polygon for community ${community.id}:`, error);
      }
    }
  }
  return null;
}

/**
 * Assigns a user to a community
 */
export async function assignUserToCommunity(userId: string, communityId: string, lat: number, lng: number, role: UserRole = "user") {
  const memberRef = doc(db, MEMBERS_COLLECTION, userId);
  
  const memberData: CommunityMember = {
    userId,
    communityId,
    joinedAt: serverTimestamp(),
    location: { lat, lng },
    role,
    alertPreferences: {
      radius: 5,
      animalTypes: ["elephant", "tiger", "leopard", "wild_boar"]
    }
  };

  await setDoc(memberRef, memberData);
  
  // Increment member count in community doc
  const communityRef = doc(db, COMMUNITIES_COLLECTION, communityId);
  await updateDoc(communityRef, {
    memberCount: increment(1)
  });

  return memberData;
}
